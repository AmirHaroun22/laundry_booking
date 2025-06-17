import React from 'react';
import './BookingLoading.css';

function BookingLoading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading bookings...</p>
    </div>
  );
}

export default BookingLoading;
