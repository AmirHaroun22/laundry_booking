from django.db import models
from .validators import validate_room, validate_day, validate_time_slot, validate_machine

class Booking(models.Model):
    day = models.DateField(validators=[validate_day])
    time_slot = models.CharField(max_length=20, validators=[validate_time_slot])
    machine = models.IntegerField(validators=[validate_machine])
    room = models.CharField(max_length=4, blank=True, null=True, validators=[validate_room])

    class Meta:
        unique_together = ['day', 'time_slot', 'machine']

    def clean(self):
        # Run all validators explecitly
        validate_day(self.day)
        validate_time_slot(self.time_slot, self.day)
        validate_machine(self.machine)
        if self.room:
            validate_room(self.room)
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.day} - {self.time_slot} Machine {self.machine}: {self.room or 'None'}"