from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Habit, HabitLog, HabitNote


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'date', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']


class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)
    notes = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'target_frequency', 'start_date', 'order', 'archived',
            'goal_type', 'goal_target', 'created_at', 'updated_at', 'logs', 'notes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        return Habit.objects.create(user=request.user, **validated_data)

    def get_notes(self, obj):
        # Only send recent 60 notes for brevity
        latest = HabitNote.objects.filter(habit=obj).order_by('-date')[:60]
        return [
            { 'date': n.date.isoformat(), 'content': n.content }
            for n in latest
        ]


class HabitNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitNote
        fields = ['id', 'date', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


