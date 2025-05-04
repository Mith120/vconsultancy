import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Booking {
  _id: string;
  userId: string;
  carId: string;
  services: Service[];
  date: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  mechanicId: string;
  totalAmount: number;
  gstAmount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
}

const AdminBookingsPage: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data: Booking[] = await response.json();
      setBookings(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error fetching bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const confirmBooking = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'confirmed' } : b))
      );
    } catch {
      // Optionally handle error
    } finally {
      setProcessingId(null);
    }
  };

  const completeBooking = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark booking as completed');
      }
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'completed' } : b))
      );
    } catch {
      // Optionally handle error
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">All Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border px-6 py-3 text-left font-semibold">Booking ID</th>
                <th className="border px-6 py-3 text-left font-semibold">User ID</th>
                <th className="border px-6 py-3 text-left font-semibold">Car ID</th>
                <th className="border px-6 py-3 text-left font-semibold">Date</th>
                <th className="border px-6 py-3 text-left font-semibold">Time Slot</th>
                <th className="border px-6 py-3 text-left font-semibold">Services</th>
                <th className="border px-6 py-3 text-left font-semibold">Status</th>
                <th className="border px-6 py-3 text-right font-semibold">Total Amount</th>
                <th className="border px-6 py-3 text-right font-semibold">GST Amount</th>
                <th className="border px-6 py-3 text-right font-semibold">Final Amount</th>
                <th className="border px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="border px-6 py-3">{booking._id}</td>
                  <td className="border px-6 py-3">{booking.userId}</td>
                  <td className="border px-6 py-3">{booking.carId}</td>
                  <td className="border px-6 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="border px-6 py-3">{booking.timeSlot.startTime} - {booking.timeSlot.endTime}</td>
                  <td className="border px-6 py-3">{booking.services.map(service => service.name).join(', ')}</td>
                  <td className="border px-6 py-3 capitalize">{booking.status}</td>
                  <td className="border px-6 py-3 text-right">₹{booking.totalAmount.toLocaleString()}</td>
                  <td className="border px-6 py-3 text-right">₹{booking.gstAmount.toLocaleString()}</td>
                  <td className="border px-6 py-3 text-right">₹{booking.finalAmount.toLocaleString()}</td>
                  <td className="border px-6 py-3 text-center">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => confirmBooking(booking._id)}
                        disabled={processingId === booking._id}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {processingId === booking._id ? 'Processing...' : 'Confirm'}
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => completeBooking(booking._id)}
                        disabled={processingId === booking._id}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {processingId === booking._id ? 'Processing...' : 'Mark as Completed'}
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <span className="text-green-700 font-semibold">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
