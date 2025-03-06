from rest_framework import serializers
from .models import Booking
from .validators import validate_room, validate_day, validate_time_slot, validate_machine
from datetime import datetime

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate_day(self, value):
        validate_day(value)
        return value

    def validate_time_slot(self, value):
        day_str = self.initial_data.get('day')
        if day_str:
            day = datetime.strptime(day_str, "%Y-%m-%d").date()
            validate_time_slot(value, day)
        else:
            validate_time_slot(value)  # fallback if day is missing
        return value

    def validate_machine(self, value):
        validate_machine(value)
        return value

    def validate_room(self, value):
        if value:
            validate_room(value)
        return value

    def validate(self, data):
        # Prevent duplicate bookings for the same day, time slot, and machine.
        if Booking.objects.filter(
            day=data['day'],
            time_slot=data['time_slot'],
            machine=data['machine']
        ).exists():
            raise serializers.ValidationError("This slot is already booked.")
        return data