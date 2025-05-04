import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Car as CarIcon, PenTool as Tool, Star, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { services } from '../data/services';
import { Service } from '../types';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [animatedServices, setAnimatedServices] = useState<Service[]>([]);

  // Animate services appearing one by one
  useEffect(() => {
    services.forEach((service, index) => {
      setTimeout(() => {
        setAnimatedServices(prev => [...prev, service]);
      }, index * 300);
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Premium Car Care Services
          </h1>
          <p className="text-xl md:text-2xl text-center text-blue-100 mb-8 max-w-3xl">
            Experience the difference with E6 Car Spa. Professional mechanics, premium products, and exceptional service.
          </p>
          <div className="mt-4">
            <Link 
              to={isAuthenticated ? "/book" : "/login"}
              className="inline-flex items-center bg-white text-blue-900 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              {isAuthenticated ? 'Book a Service' : 'Sign In to Book'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Welcome Back Section (for authenticated users) */}
      {isAuthenticated && (
        <div className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullName}!</h2>
                <p className="text-gray-600 mt-1">Ready for your next premium car service?</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  to="/book"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Services Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Premium Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a wide range of car services to keep your vehicle in perfect condition
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animatedServices.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  animation: 'fadeInUp 0.5s ease-out'
                }}
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-bold">₹{service.price.toLocaleString()}</span>
                    <Link
                      to={isAuthenticated ? "/book" : "/login"}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Book Service
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose E6 Car Spa?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to providing the highest quality car care services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Tool className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Technicians</h3>
              <p className="text-gray-600">
                Our team consists of certified mechanics with years of experience
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Service</h3>
              <p className="text-gray-600">
                We use only the highest quality products and equipment
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <CarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Car Brands</h3>
              <p className="text-gray-600">
                We service all car makes and models, domestic and imported
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfied Customers</h3>
              <p className="text-gray-600">
                Thousands of happy customers trust us with their vehicles
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CarIcon className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">E6 Car Spa</span>
              </div>
              <p className="text-blue-200 mb-4">
                Premium car services to keep your vehicle in perfect condition.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  Instagram
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  Twitter
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-200 hover:text-white">Home</Link></li>
                <li><Link to="/book" className="text-blue-200 hover:text-white">Book Service</Link></li>
                <li><Link to="/about" className="text-blue-200 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-blue-200 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-blue-200 mb-2">123 Service Road, Bengaluru</p>
              <p className="text-blue-200 mb-2">+91 9876543210</p>
              <p className="text-blue-200">support@e6carspa.com</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-800 text-center">
            <p className="text-blue-200">
              &copy; {new Date().getFullYear()} E6 Car Spa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
