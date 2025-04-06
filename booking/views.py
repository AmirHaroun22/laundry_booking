from datetime import datetime, timedelta
from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    logger.info(f"CSRF Token from Header: {request.headers.get('X-CSRFToken')}")
    logger.info(f"CSRF Token from Cookie: {request.COOKIES.get('csrftoken')}")
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({'message': 'Login successful', 'user': user.username})
    return JsonResponse({'error': 'Invalid credentials'}, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return JsonResponse({'authenticated': True, 'user': request.user.username})

@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token, 'message': 'CSRF cookie set'})

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_slots(request):
    day_str = request.GET.get('day')
    if day_str:
        day = datetime.strptime(day_str, "%Y-%m-%d").date()
    else:
        day = datetime.now().date()
    
    # Generate time slots (e.g., in 2-hour intervals)
    time_slots = [f"{str(h).zfill(2)}:00-{str(h+2).zfill(2)}:00" for h in range(0, 24, 2)]
    
    data = {
        'day': day.strftime("%Y-%m-%d"),
        'day_name': day.strftime("%A"),
        'previous_day': (day - timedelta(days=1)).strftime("%Y-%m-%d"),
        'next_day': (day + timedelta(days=1)).strftime("%Y-%m-%d"),
        'time_slots': time_slots,
    }
    return Response(data)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bookings_for_day(request):
    print(f"UTC time: {timezone.now()}")
    print(f"Local time: {timezone.localtime(timezone.now())}")
    if request.method == 'GET':
        day_str = request.GET.get('day')
        day = datetime.strptime(day_str, "%Y-%m-%d").date() if day_str else datetime.now().date()
        bookings = Booking.objects.filter(day=day)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # If room is empty, delete booking
        day_str = request.data.get('day')
        time_slot = request.data.get('time_slot')
        machine = request.data.get('machine')
        room = request.data.get('room')

        if not(day_str and time_slot and machine is not None):
            return Response({'error': 'Missing required fields'}, status=400)
        
        day = datetime.strptime(day_str, "%Y-%m-%d").date()
        
        if room == "" or room is None:
            try:
                booking = Booking.objects.get(day=day, time_slot=time_slot, machine=machine)
                local_now = timezone.localtime(timezone.now())
                booking_start = datetime.strptime(booking.time_slot.split('-')[0], "%H:%M").time()

                if booking.day < local_now.date() or (booking.day == local_now.date() and booking_start < local_now.time()):
                    # The booking is in the past
                    return Response({'error': 'Cannot delete a booking in the past'}, status=403)
                booking.delete()
                return Response({'message': 'Booking deleted'})
            except Booking.DoesNotExist:
                return Response({'message': 'No booking to delete'}, status=404)
        else:
            # Use update_or_create then enforce validation
            booking, created = Booking.objects.update_or_create(
                day=day,
                time_slot=time_slot,
                machine=machine,
                defaults={'room': room}
            )
            try:
                booking.full_clean()
                booking.save()
            except Exception as e:
                return Response({'error': str(e)}, status=400)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)

def home(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'home.html')

class CustomLoginView(LoginView):
    template_name = 'registration/login.html'

    def dispatch(self, request, *args, **kwargs):
        # If the user is already authenticated, redirect to the home page
        if request.user.is_authenticated:
            return redirect('home')
        return super().dispatch(request, *args, **kwargs)