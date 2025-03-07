from rest_framework import serializers
from .models import Booking
from .validators import validate_room, validate_day, validate_time_slot, validate_machine
from datetime import datetime

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        # Prevent duplicate bookings for the same day, time slot, and machine.
        if Booking.objects.filter(
            day=data['day'],
            time_slot=data['time_slot'],
            machine=data['machine']
        ).exists():
            raise serializers.ValidationError("This slot is already booked.")
        return data