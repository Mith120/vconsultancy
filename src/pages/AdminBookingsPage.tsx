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
  createdAt: string;
}

const AdminBookingsPage: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

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
                <th className="border px-6 py-3 text-right font-semibold">Total Amount</th>
                <th className="border px-6 py-3 text-right font-semibold">GST Amount</th>
                <th className="border px-6 py-3 text-right font-semibold">Final Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-t border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition-colors duration-200`}
                >
                  <td className="border px-6 py-3">{booking._id}</td>
                  <td className="border px-6 py-3">{booking.userId}</td>
                  <td className="border px-6 py-3">{booking.carId}</td>
                  <td className="border px-6 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="border px-6 py-3">{booking.timeSlot.startTime} - {booking.timeSlot.endTime}</td>
                  <td className="border px-6 py-3">
                    {booking.services.map((service: Service) => service.name).join(', ')}
                  </td>
                  <td className="border px-6 py-3 text-right">₹{booking.totalAmount.toLocaleString()}</td>
                  <td className="border px-6 py-3 text-right">₹{booking.gstAmount.toLocaleString()}</td>
                  <td className="border px-6 py-3 text-right">₹{booking.finalAmount.toLocaleString()}</td>
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
