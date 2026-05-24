from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, ResendOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='api-register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='api-verify-otp'),
    path('login/', LoginView.as_view(), name='api-login'),
    path('resend-otp/', ResendOTPView.as_view(), name='api-resend-otp'),
]