from django.urls import path
from .views import (
    login_view,
    logout_view,
    check_auth,
    get_csrf_token,
    booking_slots,
    bookings_for_day,
    home
)

urlpatterns = [
    # Authentication endpoints
    path('login/', login_view, name='api_login'),
    path('logout/', logout_view, name='api_logout'),
    path('check-auth/', check_auth, name='check_auth'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    
    # Protected API endpoints
    path('booking_slots/', booking_slots, name='booking_slots'),
    path('bookings/', bookings_for_day, name='bookings_for_day'),
    ]