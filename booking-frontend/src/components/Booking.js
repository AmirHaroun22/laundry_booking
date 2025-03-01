import React, { useEffect, useState } from 'react';

const Booking = () => {
    const[data, setData] = useState(null);

    const fetchBookingData = (dayParam = '') => {
        let url = 'http://localhost:8000/api/booking_slots';
        if (dayParam) {
            url += `?day=${dayParam}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error('Error Fetching Booking Data', error));
    };

    // Initial load: fetch today's booking data
    useEffect(() => {
        fetchBookingData();
    }, []);

    const handlePreviousDay = () => {
        fetchBookingData(data.previous_day);
    };
    
    const handleNextDay = () => {
        fetchBookingData(data.next_day);
    };

    if (!data) return <div>Loading...</div>

    return (
        <div>
            <h1>Booking for {data.day}</h1>
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
                    {data.time_slots.map(slot => (
                        <tr key={`${data.day}-${slot}`}>
                            <td>{slot}</td>
                            <td><input type='text' placeholder='Room'/></td>
                            <td><input type='text' placeholder='Room'/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Booking;