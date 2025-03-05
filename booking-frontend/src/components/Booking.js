import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../config';

const API_BASE_URL = CONFIG.API_BASE_URL;

const Booking = () => {
    const[slotData, setSlotData] = useState(null);
    const[bookings, setBookings] = useState({});
    const[notification, setNotification] = useState('');
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

    const validateRoomIdNumber = (value) => {
        if (!/^\d{4}$/.test(value)) {
            return 'Room ID number must be 4 digits';
        }
        const floor = parseInt(value.substring(0, 2), 10);
        const roomNum = parseInt(value.substring(2), 10);
        if (floor < 1 || floor > 17) {
            return 'Floor number must be between 01 and 17';
        }
        if (floor >= 1 && floor <= 4) {
            if (roomNum < 1 || roomNum > 16) {
                return 'For floors 01-04, room number must be between 01 and 16';
            }
        } else if (floor >= 5 && floor <= 17) {
            if (roomNum < 1 || roomNum > 10) {
                return 'For floors 05-17, room number must be between 01 and 10';
            }
        }
        return null;
    };

    // Update state when an input field is changed
    const handleInputChange = (slot, machine, value) => {
        const key = `${slot}_${machine}`;
        setBookings(prv => ({ ...prv, [key]: value }));

        // Input validation
        if (value !== '' ) {
            const error = validateRoomIdNumber(value);
            if (error) {
                setNotification(error);
                return;
            }
        }

        // Clear the previous timer if it exists
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        // Set a new timer to call the API after 2 seconds
        debounceTimer.current = setTimeout(() => {
            fetch(`${API_BASE_URL}/api/bookings/`, {
                method: 'POST',
                body: JSON.stringify({ day: slotData.day, time_slot: slot, machine, room: value }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Booking updated successfully', data);
                    setNotification('Booking updated successfully');
                    setTimeout(() => setNotification(''), 3000);
                })
                .catch(error => {
                    console.error('Error saving booking', error);
                    setNotification('Error saving booking');
                    setTimeout(() => setNotification(''), 3000);
                });
                    
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
            {notification && <div className='notification'>{notification}</div>}
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
                                placeholder='Room ID number(e.g. 0312)'
                                value={bookings[`${slot}_1`] || ''}
                                onChange={(e) => handleInputChange(slot, 1, e.target.value)}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                pattern="^((0[1-4])(0[1-9]|1[0-6])|(0[5-9]|1[0-7])(0[1-9]|10))$"
                                maxLength="4"
                                title='Room ID number must be 4 digits'
                                />
                            </td>
                            <td>
                                <input
                                type='text'
                                placeholder='Room ID number(e.g. 0312)'
                                value={bookings[`${slot}_2`] || ''}
                                onChange={(e) => handleInputChange(slot, 2, e.target.value)}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                pattern="^((0[1-4])(0[1-9]|1[0-6])|(0[5-9]|1[0-7])(0[1-9]|10))$"
                                maxLength="4"
                                title='Room ID number must be 4 digits'
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