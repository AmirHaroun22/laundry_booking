from django.urls import path
from . import views
from .api_views import booking_slots, bookings_for_day

urlpatterns = [
    path('', views.index, name='index'),
    path('api/booking_slots/', booking_slots, name='booking_slots'),
    path('api/bookings/', bookings_for_day, name='bookings_for_day'),
    ]