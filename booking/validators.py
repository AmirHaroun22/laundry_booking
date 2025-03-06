import re
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime

def validate_room(value):
    """Ensure the room number is 4 digits and valid based on floor."""
    if not value:
        return  # Allow empty values (booking deletion)
    if not re.match(r'^\d{4}$', value):
        raise ValidationError("Room ID number must be exactly 4 digits.")
    floor = int(value[:2])
    room_num = int(value[2:])
    if not (1 <= floor <= 17):
        raise ValidationError("Floor number must be between 01 and 17.")
    if (1 <= floor <= 4 and not (1 <= room_num <= 16)) or (5 <= floor <= 17 and not (1 <= room_num <= 10)):
        raise ValidationError("Invalid room number for the given floor.")

def validate_time_slot(value, day=None):
    """Ensure the time slot is in 'HH:MM-HH:MM' format and not in the past if day is today."""
    if not re.match(r'^\d{2}:\d{2}-\d{2}:\d{2}$', value):
        raise ValidationError("Time slot must be in the format 'HH:MM-HH:MM'.")
    if day and day == timezone.localtime(timezone.now()).date():
        now = timezone.localtime(timezone.now()).time()
        start_time_str, _ = value.split('-')
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        if start_time < now:
            raise ValidationError("Cannot book a time slot that has already passed today.")

def validate_machine(value):
    """Ensure the machine number is 1 or 2."""
    if value not in {1, 2}:
        raise ValidationError("Machine number must be either 1 or 2.")

def validate_day(value):
    """Ensure the booking day is not in the past."""
    local_now = timezone.localtime(timezone.now()).date()
    if value < local_now:
        raise ValidationError("Booking date cannot be in the past.")
