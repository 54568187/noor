from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=11, unique=True, verbose_name="شماره موبایل")
    username = models.CharField(max_length=50, unique=True, verbose_name="نام کاربری")
    is_active = models.BooleanField(default=False, verbose_name="فعال") # کاربر تا تایید OTP غیرفعال است
    is_staff = models.BooleanField(default=False, verbose_name="کارمند")
    date_joined = models.DateTimeField(default=timezone.now, verbose_name="تاریخ عضویت")

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.phone_number

class OTP(models.Model):
    phone_number = models.CharField(max_length=11, verbose_name="شماره موبایل")
    code = models.CharField(max_length=6, verbose_name="کد تایید")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    def __str__(self):
        return f"{self.phone_number} - {self.code}"
    
    class Meta:
        verbose_name = "کد یک‌بارمصرف"
        verbose_name_plural = "کدهای یک‌بارمصرف"