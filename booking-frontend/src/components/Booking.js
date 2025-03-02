import React, { useEffect, useState } from 'react';

const Booking = () => {
    const[slotData, setSlotData] = useState(null);
    const[bookings, setBookings] = useState({});

    const fetchBookingData = (dayParam = '') => {
        let url = 'http://localhost:8000/api/booking_slots/';
        if (dayParam) {
            url += `?day=${dayParam}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(json => {
                setSlotData(json);
                fetch(`http://localhost:8000/api/bookings/?day=${json.day}`)
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
        setBookings({...bookings, [key]: value});
        fetch('http://localhost:8000/api/bookings/', { method: 'POST', body: JSON.stringify({day: slotData.day, time_slot: slot, machine, room: value}), headers: {'Content-Type': 'application/json'} });
    };

    const handlePreviousDay = () => {
        fetchBookingData(slotData.previous_day);
    };
    
    const handleNextDay = () => {
        fetchBookingData(slotData.next_day);
    };

    if (!slotData) return <div>Loading...</div>

    return (
        <div>
            <h1>Booking for {slotData.day_name}, {slotData.day}</h1>
            <div className='navigation'>
                <button onClick={handlePreviousDay}>Previous Day</button>
                <button onClick={handleNextDay}>Next Day</button>
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