from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta
from .models import Booking
from .serializer import BookingSerializer


@api_view(['GET'])
def booking_slots(request):
    # Retrieve the date from the query parameters or default to today
    date_str = request.GET.get('day')
    if date_str:
        day = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        day = datetime.now().date()
    
    # Generate time slots in the format "HH:MM-HH:MM" with a 2-hour step
    time_slots = [f"{str(h).zfill(2)}:00-{str(h+2).zfill(2)}:00" for h in range(0, 24, 2)]

    # prepare the response data
    data = {
        'day': day.strftime("%Y-%m-%d"),
        'day_name': day.strftime("%A"),
        'previous_day': (day - timedelta(days=1)).strftime("%Y-%m-%d"),
        'next_day': (day + timedelta(days=1)).strftime("%Y-%m-%d"),
        'time_slots': time_slots,
    }
    return Response(data)

@api_view(['GET', 'POST'])
def bookings_for_day(request):
    if request.method == 'GET':
        day_str = request.GET.get('day')
        if day_str:
            day = datetime.strptime(day_str, "%Y-%m-%d").date()
        else:
            day = datetime.now().date()
        bookings = Booking.objects.filter(day=day)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        day_str = request.data.get('day')
        time_slot = request.data.get('time_slot')
        machine = request.data.get('machine')
        room = request.data.get('room')

        if not(day_str and time_slot and machine is not None):
            return Response({'error': 'Missing required fields'}, status=400)
        
        day = datetime.strptime(day_str, "%Y-%m-%d").date()

        # If room is empty, delete any existing booking for this slot
        if room == "" or room is None:
            try:
                booking = Booking.objects.get(day=day, time_slot=time_slot, machine=machine)
                booking.delete()
                return Response({'message': 'Booking deleted'})
            except Booking.DoesNotExist:
                return Response({'message': 'No booking to delete'})
        else:
            booking, created = Booking.objects.update_or_create(
                day=day,
                time_slot=time_slot,
                machine=machine,
                defaults={'room': room}
            )
            serializer = BookingSerializer(booking)
            return Response(serializer.data)