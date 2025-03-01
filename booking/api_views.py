from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta


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
        'previous_day': (day - timedelta(days=1)).strftime("%Y-%m-%d"),
        'next_day': (day + timedelta(days=1)).strftime("%Y-%m-%d"),
        'time_slots': time_slots,
    }
    return Response(data)