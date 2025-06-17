from django.urls import path
from .views import (
    BookingListView,
    BookingCreateView,
    BookingUpdateView,
    BookingDeleteView,
    CurrentUserView,
    home
)

app_name = 'booking'

urlpatterns = [
    path('bookings/', BookingListView.as_view(), name='booking-list'),
    path('bookings/create/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/update/', BookingUpdateView.as_view(), name='booking-update'),
    path('bookings/delete/', BookingDeleteView.as_view(), name='booking-delete'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
]