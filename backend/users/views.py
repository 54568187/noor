from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.utils import timezone
from .models import CustomUser, OTP
from .serializers import RegisterSerializer, VerifyOTPSerializer, LoginSerializer
import random

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = CustomUser.objects.create_user(
                phone_number=serializer.validated_data['phone'],
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            code = str(random.randint(10000, 99999))
            OTP.objects.create(phone_number=user.phone_number, code=code)
            
            # TODO: اتصال به پنل پیامکی
            print(f"SMS Sent to {user.phone_number}: Code is {code}") 

            return Response({
                "message": "کد تایید ارسال شد"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            code = serializer.validated_data['code']

            otp_obj = OTP.objects.filter(phone_number=phone).last()
            if otp_obj and otp_obj.code == code:
                user = CustomUser.objects.get(phone_number=phone)
                user.is_active = True
                user.save()
                
                OTP.objects.filter(phone_number=phone).delete()
                
                user_has_profile = hasattr(user, 'profile') and user.profile.interests.exists()

                return Response({
                    "message": "ثبت‌نام کامل شد",
                    "tokens": get_tokens_for_user(user),
                    "user": {
                        "username": user.username,
                        "has_completed_profiling": user_has_profile
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({"error": "کد وارد شده اشتباه یا منقضی شده است."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']

            user = CustomUser.objects.filter(
                Q(phone_number=identifier) | Q(username=identifier)
            ).first()

            if user and user.check_password(password):
                if user.is_active:
                    user_has_profile = hasattr(user, 'profile') and user.profile.interests.exists()
                    
                    return Response({
                        "message": "ورود موفقیت‌آمیز",
                        "tokens": get_tokens_for_user(user),
                        "user": {
                            "username": user.username,
                            "has_completed_profiling": user_has_profile
                        }
                    }, status=status.HTTP_200_OK)
                return Response({"error": "حساب کاربری شما هنوز فعال نشده است. لطفاً ثبت‌نام را کامل کنید."}, status=status.HTTP_403_FORBIDDEN)
            
            return Response({"error": "شماره موبایل/نام‌کاربری یا رمز عبور اشتباه است."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response({"error": "شماره موبایل الزامی است"}, status=status.HTTP_400_BAD_REQUEST)
            
        user = CustomUser.objects.filter(phone_number=phone).first()
        if not user:
            return Response({"error": "کاربری با این شماره یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
            
        if user.is_active:
            return Response({"error": "این حساب کاربری قبلاً فعال شده است"}, status=status.HTTP_400_BAD_REQUEST)

        last_otp = OTP.objects.filter(phone_number=phone).last()
        if last_otp:
            time_diff = timezone.now() - last_otp.created_at
            if time_diff.total_seconds() < 120:
                remaining_time = int(120 - time_diff.total_seconds())
                return Response({
                    "error": f"لطفاً {remaining_time} ثانیه دیگر صبر کنید."
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        OTP.objects.filter(phone_number=phone).delete()
        
        new_code = str(random.randint(10000, 99999))
        OTP.objects.create(phone_number=phone, code=new_code)
        
        print(f"RESENT SMS to {phone}: Code is {new_code}") 
        
        return Response({"message": "کد جدید با موفقیت ارسال شد"}, status=status.HTTP_200_OK)