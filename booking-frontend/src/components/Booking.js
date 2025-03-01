import React, { useEffect, useState } from 'react';

const Booking = () => {
    const[data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/booking_slots')
            .then(response => response.json())
            .then(json => setData(json))
    }, []);

    if (!data) return <div>Loading...</div>

    return (
        <div>
            <h1>Booking for {data.day}</h1>
            <div className='navigation'>
                <a href={`?day=${data.previous_day}`}>Previous Day</a>
                <a href={`?day=${data.next_day}`}>Next Day</a>
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
                        <tr key={slot}>
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