import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  name: string;
  price: number;
}

interface Booking {
  _id: string;
  date: string;
  services: Service[];
  totalAmount: number;
  status: string;
}

const BookingsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data || []);
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
  }, [user, token]);

  if (loading) {
    return <div className="p-8 text-center">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your bookings.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow rounded-lg p-4">
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
              <div>
                <strong>Services:</strong>
                <ul className="list-disc list-inside">
                  {booking.services.map((service, idx) => (
                    <li key={idx}>{service.name} - ₹{service.price.toLocaleString()}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Total Amount:</strong> ₹{booking.totalAmount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
