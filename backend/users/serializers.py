from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True)

    def validate_phone(self, value):
        if CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("این شماره موبایل قبلا ثبت شده است.")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("این نام کاربری قبلا گرفته شده است.")
        return value

class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)
    code = serializers.CharField(max_length=5) 

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField() 
    password = serializers.CharField(write_only=True)