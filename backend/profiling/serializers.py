from rest_framework import serializers
from .models import InterestCategory

class InterestCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestCategory
        fields = ['id', 'title', 'slug']