from datetime import datetime, timedelta
from django.shortcuts import render
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer


class BookingListView(generics.ListAPIView):
    """
    View to list all bookings.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Booking.objects.all()
        date = self.request.query_params.get('date')
        time_slot = self.request.query_params.get('time_slot')
        machine = self.request.query_params.get('machine')

        if date:
            queryset = queryset.filter(date=date)
        if time_slot:
            queryset = queryset.filter(time_slot=time_slot)
        if machine:
            queryset = queryset.filter(machine=machine)
        return queryset

class BookingCreateView(generics.CreateAPIView):
    """
    View to create a new booking.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()

    def perform_create(self, serializer):
        date = self.request.data.get('date')
        time_slot = self.request.data.get('time_slot')
        machine = self.request.data.get('machine')

        existing = Booking.objects.filter(
            date=date,
            time_slot=time_slot,
            machine=machine
        ).first()
        if existing:
            raise serializers.ValidationError("Booking already exists for this date, time slot, and machine.")
        serializer.save()

class BookingUpdateView(generics.UpdateAPIView):
    """
    View to update an existing booking.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()

    def get_object(self):
        date = self.request.data.get('date')
        time_slot = self.request.data.get('time_slot')
        machine = self.request.data.get('machine')

        queryset = Booking.objects.filter(date=date, time_slot=time_slot, machine=machine)

        obj = queryset.first()
        if not obj:
            raise serializers.ValidationError("Booking does not exist for this date, time slot, and machine.")
        return obj

class BookingDeleteView(generics.DestroyAPIView):
    """
    View to delete an existing booking.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        date = self.request.query_params.get('date')
        time_slot = self.request.query_params.get('time_slot')
        machine = self.request.query_params.get('machine')

        queryset = Booking.objects.all()
        if date and time_slot and machine:
            queryset = queryset.filter(date=date, time_slot=time_slot, machine=machine)
        return queryset
    
class CurrentUserView(APIView):
    """
    View to get the current logged-in user's info.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.username})



def home(request):
    return render(request, 'home.html')