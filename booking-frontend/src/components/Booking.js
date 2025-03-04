import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../config';

const API_BASE_URL = CONFIG.API_BASE_URL;

const Booking = () => {
    const[slotData, setSlotData] = useState(null);
    const[bookings, setBookings] = useState({});
    const debounceTimer = useRef(null);

    const getDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchBookingData = (dayParam = '') => {
        let url = `${API_BASE_URL}/api/booking_slots/`;
        if (dayParam) {
            url += `?day=${dayParam}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(json => {
                setSlotData(json);
                fetch(`${API_BASE_URL}/api/bookings/?day=${json.day}`)
                    .then(response => response.json())
                    .then(bookingsData => {
                        const bookingMap = {};
                        bookingsData.forEach(b => {
                            bookingMap[`${b.time_slot}_${b.machine}`] = b.room;
                        });
                        setBookings(bookingMap);
                    });
            })
            .catch(error => console.error('Error Fetching booking Data', error));
    };

    useEffect(() => {
        fetchBookingData();
    }, []);

    // Update state when an input field is changed
    const handleInputChange = (slot, machine, value) => {
        const key = `${slot}_${machine}`;
        setBookings(prv => ({ ...prv, [key]: value }));

        //clear the previous timer if it exists
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        //Set a new timer to call the API after 2 seconds
        debounceTimer.current = setTimeout(() => {
            fetch(`${API_BASE_URL}/api/bookings/`, {
                method: 'POST',
                body: JSON.stringify({ day: slotData.day, time_slot: slot, machine, room: value }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => console.log('Booking saved', data))
                .catch(error => console.error('Error saving booking', error));
        }, 2000);
    };

    const handlePreviousWeek = () => {
        const currentDate = new Date(slotData.day);
        currentDate.setDate(currentDate.getDate() - 7);
        const newDate = getDateString(currentDate);
        fetchBookingData(newDate);
    };

    const handleNextWeek = () => {
        const currentDate = new Date(slotData.day);
        currentDate.setDate(currentDate.getDate() + 7);
        const newDate = getDateString(currentDate);
        fetchBookingData(newDate);
    };

    const handlePreviousDay = () => {
        fetchBookingData(slotData.previous_day);
    };
    
    const handleNextDay = () => {
        fetchBookingData(slotData.next_day);
    };

    const handleToday = () => {
        const today = new Date();
        const newDate = getDateString(today);
        fetchBookingData(newDate);
    };

    if (!slotData) return <div>Loading...</div>

    return (
        <div>
            <h1>Booking for {slotData.day_name}, {slotData.day}</h1>
            <div className='navigation'>
                <button onClick={handlePreviousWeek}>Previous Week</button>
                <button onClick={handlePreviousDay}>Previous Day</button>
                <button onClick={handleToday}>Today</button>
                <button onClick={handleNextDay}>Next Day</button>
                <button onClick={handleNextWeek}>Next Week</button>
            </div>
            <table border='1'>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Machine 1</th>
                        <th>Machine 2</th>
                    </tr>
                </thead>
                <tbody>
                    {slotData.time_slots.map(slot => (
                        <tr key={`${slotData.day}-${slot}`}>
                            <td>{slot}</td>
                            <td>
                                <input
                                type='text'
                                placeholder='Room'
                                value={bookings[`${slot}_1`] || ''}
                                onChange={(e) => handleInputChange(slot, 1, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                type='text'
                                placeholder='Room'
                                value={bookings[`${slot}_2`] || ''}
                                onChange={(e) => handleInputChange(slot, 2, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Booking;