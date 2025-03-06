# Generated by Django 5.1.4 on 2025-03-05 13:11

import booking.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0003_alter_booking_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='day',
            field=models.DateField(validators=[booking.validators.validate_day]),
        ),
        migrations.AlterField(
            model_name='booking',
            name='machine',
            field=models.IntegerField(validators=[booking.validators.validate_machine]),
        ),
        migrations.AlterField(
            model_name='booking',
            name='time_slot',
            field=models.CharField(max_length=20, validators=[booking.validators.validate_time_slot]),
        ),
    ]
