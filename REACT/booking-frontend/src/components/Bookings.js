import React, { useState, useEffect, useRef } from 'react';
import HorizontalCalendar from './HorizontalCalendar';
import { authFetch } from '../utils/auth';
import { formatLocalDate } from '../utils/dateUtils';
import './Bookings.css';
import BookingLoading from './BookingLoading';
import config from '../config';

function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState({});
  const [notification, setNotification] = useState('');
  const debounceTimer = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate]);

  const fetchBookings = async (date) => {
    try {
      setLoading(true);
      const formattedDate = formatLocalDate(date);
      
      const response = await authFetch(
        `${config.API_BASE_URL}/bookings/?date=${formattedDate}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      const bookingMap = {};

      data.forEach((item) => {
        const { time_slot, machine, room } = item;
        if (!bookingMap[time_slot]) bookingMap[time_slot] = ['', '', ''];
        bookingMap[time_slot][machine - 1] = room;
      });

      setBookings(bookingMap);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setNotification('Failed to load bookings');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = 0 * 60;
    const end = 24 * 60;

    for (let minutes = start; minutes < end; minutes += 120) {
      const endSlot = minutes + 120;
      slots.push(`${formatTime(minutes)}-${formatTime(endSlot)}`);
    }
    return slots;
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const isPastTimeSlot = (slot) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDay = new Date(
      selectedDate.getFullYear(), 
      selectedDate.getMonth(), 
      selectedDate.getDate()
    );

    if (selectedDay < today) return true;
    if (selectedDay > today) return false;

    const [startTime] = slot.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    const slotTime = new Date(
      now.getFullYear(), 
      now.getMonth(), 
      now.getDate(), 
      hours, 
      minutes
    );

    return slotTime < now;
  };

  const handleBookingChange = async (slot, resourceIndex, value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        if (value) {
          await checkBookingExists(slot, resourceIndex + 1, value);
        } else {
          await deleteBooking(slot, resourceIndex + 1);
        }
      } catch (error) {
        console.error('Error handling booking:', error);
        setNotification('Failed to process booking');
        setTimeout(() => setNotification(''), 3000);
      }
    }, 1000);
  };

  const checkBookingExists = async (time_slot, machine, room) => {
    const formattedDate = formatLocalDate(selectedDate);
    const response = await authFetch(
      `${config.API_BASE_URL}/bookings/?date=${formattedDate}&time_slot=${encodeURIComponent(time_slot)}&machine=${machine}`
    );
    
    if (!response.ok) throw new Error('Failed to check booking');
    
    const data = await response.json();
    const exists = Array.isArray(data) && data.length > 0;
    
    if (exists) {
      await updateBooking(time_slot, machine, room);
    } else {
      await createBooking(time_slot, machine, room);
    }
  };

  const createBooking = async (time_slot, machine, room) => {
    const response = await authFetch(`${config.API_BASE_URL}/bookings/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: formatLocalDate(selectedDate),
        time_slot,
        machine,
        room
      })
    });

    if (!response.ok) throw new Error('Failed to create booking');

    setNotification('Booking created successfully');
    setTimeout(() => setNotification(''), 3000);
  };

  const updateBooking = async (time_slot, machine, room) => {
    const response = await authFetch(`${config.API_BASE_URL}/bookings/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: formatLocalDate(selectedDate),
        time_slot,
        machine,
        room
      })
    });

    if (!response.ok) throw new Error('Failed to update booking');

    setNotification('Booking updated successfully');
    setTimeout(() => setNotification(''), 3000);
  };

  const deleteBooking = async (time_slot, machine) => {
    const formattedDate = formatLocalDate(selectedDate);
    const response = await authFetch(
      `${config.API_BASE_URL}/bookings/delete/?date=${formattedDate}&time_slot=${encodeURIComponent(time_slot)}&machine=${machine}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) throw new Error('Failed to delete booking');

    setNotification('Booking deleted successfully');
    setTimeout(() => setNotification(''), 3000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // if (loading) return <div>Loading...</div>;
  if (loading) return <BookingLoading></BookingLoading>;

  const slots = generateTimeSlots();

  return (
    <div className="bookings-container">
      {notification && <div className="notification">{notification}</div>}
      <div className="booking-content">
        <div className="calendar-section">
          <HorizontalCalendar
            startDate={new Date(new Date().setDate(new Date().getDate() - 3))}
            totalDays={7}
            initialSelectedDate={selectedDate}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
        <div className="table-section">
          <div className="table-header">
            <h3 className="date-header">{selectedDate.toDateString()}</h3>
          </div>
          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Machine 1</th>
                  <th>Machine 2</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot}>
                    <td>{slot}</td>
                    {[0, 1].map((resourceIndex) => (
                      <td key={resourceIndex}>
                        <input
                          type="text"
                          defaultValue={bookings[slot]?.[resourceIndex] || ''}
                          onChange={(e) => handleBookingChange(slot, resourceIndex, e.target.value)}
                          disabled={isPastTimeSlot(slot)}
                          className="booking-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;