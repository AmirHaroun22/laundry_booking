from django.db import models
from .validators import validate_room, validate_date, validate_time_slot, validate_machine

class Booking(models.Model):
    date = models.DateField(validators=[validate_date])
    time_slot = models.CharField(max_length=20, validators=[validate_time_slot])
    machine = models.IntegerField(validators=[validate_machine])
    room = models.CharField(max_length=4, validators=[validate_room])

    class Meta:
        unique_together = ['date', 'time_slot', 'machine']

    def clean(self):
        validate_time_slot(self.time_slot, self.date)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} - {self.time_slot} Machine {self.machine}: {self.room}"