from datetime import datetime, timedelta
from django.shortcuts import render
from rest_framework import generics, permissions, serializers, status
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

    def delete(self, request, *args, **kwargs):
        date = request.query_params.get('date')
        time_slot = request.query_params.get('time_slot')
        machine = request.query_params.get('machine')

        if not (date and time_slot and machine):
            return Response({'detail': 'Missing parameters.'}, status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.filter(date=date, time_slot=time_slot, machine=machine).first()
        if not booking:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CurrentUserView(APIView):
    """
    View to get the current logged-in user's info.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.username})



def home(request):
    return render(request, 'home.html')