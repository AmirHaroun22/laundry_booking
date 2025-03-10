# laundry_booking

This is a Laundry Booking System that allows users to book washing machines at different time slots. The project consists of a Django backend and a React frontend.

## Prerequisites

Before running the project, ensure you have the following installed:

- Python 3.x
- Node.js and npm

## Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/AmirHaroun22/laundry_booking.git
   cd laundry_booking
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies & run migrations:

   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```

4. Run the development server:

   ```bash
   python manage.py runserver
   ```

## Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd booking-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server: 

   ```bash
   npm start
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/booking_slots/` | Fetch available booking slots |
| GET | `/api/bookings/?day=YYYY-MM-DD` | Fetch bookings for a specific day |
| POST | `/api/bookings/` | Create or delete a booking |


## Contributing

Feel free to fork and submit pull requests. For major changes, please open an issue first to discuss the changes.

## License

This project is licensed under the MIT License.