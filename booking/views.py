from django.shortcuts import render
from datetime import datetime, timedelta

def index(request):
    # Get the date from the query parameters or default to today
    date_str = request.GET.get('day')
    if date_str:
        day = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        day = datetime.now().date()

    # Generate time slots in the format "HH:MM-HH:MM" with a 2-hour step
    time_slots = [f"{str(h).zfill(2)}:00-{str(h+2).zfill(2)}:00" for h in range(0, 24, 2)]

    previous_day = day - timedelta(days=1)
    next_day = day + timedelta(days=1)

    context = {
        'day': day,
        'previous_day': previous_day,
        'next_day': next_day,
        'time_slots': time_slots,
    }
    return render(request, 'booking/index.html', context)
