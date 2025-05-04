import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookServicePage from './pages/BookServicePage';
// Removed PaymentPage import as payment is removed
import BookingSuccessPage from './pages/BookingSuccessPage';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/book" element={<BookServicePage />} />
            {/* Removed payment route */}
            <Route path="/booking-success" element={<BookingSuccessPage />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
