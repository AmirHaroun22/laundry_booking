import re
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime

def validate_room(value):
    """Ensure the room number is 4 digits and valid based on floor."""
    if not value:
        return 
    if not re.match(r'^\d{4}$', value):
        raise ValidationError("Room ID number must be exactly 4 digits.")
    floor = int(value[:2])
    room_num = int(value[2:])
    if not (1 <= floor <= 17):
        raise ValidationError("Floor number must be between 01 and 17.")
    if (1 <= floor <= 4 and not (1 <= room_num <= 16)) or (5 <= floor <= 17 and not (1 <= room_num <= 10)):
        raise ValidationError("Invalid room number for the given floor.")

def validate_time_slot(value, date=None):
    """Validate time slot format, allowed 2-hour blocks, and prevent past bookings."""
    if not re.match(r'^\d{2}:\d{2}-\d{2}:\d{2}$', value):
        raise ValidationError("Time slot must be in the format 'HH:MM-HH:MM'.")
    
    valid_slots = [
        f"{h:02d}:00-{(h+2):02d}:00" 
        for h in range(0, 24, 2)
    ]
    
    if value not in valid_slots:
        raise ValidationError(
            "Invalid time slot. Must be a 2-hour block starting at even hours. "
            "Valid examples: '00:00-02:00', '10:00-12:00'"
        )
    
    if date and date == timezone.localdate():
        start_time_str, _ = value.split('-')
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        current_time = timezone.localtime().time()
        
        if start_time < current_time:
            raise ValidationError("Cannot book a time slot that has already passed today.")

def validate_machine(value):
    """Ensure the machine number is 1 or 2."""
    if value not in {1, 2}:
        raise ValidationError("Machine number must be either 1 or 2.")

def validate_date(value):
    """Ensure the booking date is not in the past."""
    local_now = timezone.localtime(timezone.now()).date()
    if value < local_now:
        raise ValidationError("Booking date cannot be in the past.")
