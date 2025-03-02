from django.db import models

class Booking(models.Model):
    day = models.DateField()
    time_slot = models.CharField(max_length=20)
    machine = models.IntegerField()
    room = models.IntegerField(blank=True, null=True)

    class Meta:
        unique_together = ['day', 'time_slot', 'machine']

    def __str__(self):
        return f"{self.day} - {self.time_slot} Machine {self.machine}: {self.room:04d}" if self.room is not None else f"{self.day} - {self.time_slot} Machine {self.machine}: None"
    