import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route to avoid 404 on GET /
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cars: [{
    brand: String,
    model: String
  }]
});

const User = mongoose.model('User', userSchema);

// Default admin credentials (hashed password)
const adminEmail = 'admin@e6carspa.com';
const adminPasswordHash = bcrypt.hashSync('Admin@123', 10); // hashed default password

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, address, cars } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
      cars
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        cars: user.cars,
        role: 'customer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint with role parameter
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'admin') {
      // Check admin credentials
      if (email === adminEmail && bcrypt.compareSync(password, adminPasswordHash)) {
        // Create JWT token for admin
        const token = jwt.sign(
          { userId: 'admin', role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: 'admin',
            fullName: 'Administrator',
            email: adminEmail,
            role: 'admin'
          }
        });
      } else {
        return res.status(400).json({ message: 'Invalid admin credentials' });
      }
    }

    // Customer login flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        cars: user.cars,
        role: 'customer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  services: [{
    id: String,
    name: String,
    price: Number
  }],
  date: Date,
  timeSlot: {
    startTime: String,
    endTime: String
  },
  mechanicId: { type: String, required: true },
  totalAmount: Number,
  gstAmount: Number,
  finalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Middleware to verify JWT token and set req.userId and req.role
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.userId;
    req.role = user.role;
    next();
  });
};

// Create booking endpoint
app.post('/api/bookings', authenticateToken, async (req, res) => {
  if (req.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can create bookings' });
  }
  try {
    const { carId, services, date, timeSlot, mechanicId, totalAmount, gstAmount, finalAmount } = req.body;

    const booking = new Booking({
      userId: req.userId,
      carId,
      services,
      date,
      timeSlot,
      mechanicId,
      totalAmount,
      gstAmount,
      finalAmount
    });

    await booking.save();

    res.status(201).json({ message: 'Booking saved successfully', booking });
  } catch (error) {
    console.error('Booking save error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get bookings for user
app.get('/api/bookings', authenticateToken, async (req, res) => {
  if (req.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can view bookings' });
  }
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ date: 1, 'timeSlot.startTime': 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all bookings sorted by date and time
app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const bookings = await Booking.find().sort({ date: 1, 'timeSlot.startTime': 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Confirm a booking
app.patch('/api/admin/bookings/:id/confirm', authenticateToken, async (req, res) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'confirmed';
    await booking.save();
    res.json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Mark booking as completed
app.patch('/api/admin/bookings/:id/complete', authenticateToken, async (req, res) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'completed';
    await booking.save();
    res.json({ message: 'Booking marked as completed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
