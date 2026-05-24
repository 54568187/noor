from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import UserProfile, InterestCategory
from .serializers import InterestCategorySerializer

class InterestListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = InterestCategory.objects.filter(is_active=True)
    serializer_class = InterestCategorySerializer

class SubmitInterestsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        interest_ids = request.data.get('interests', [])
        
        if len(interest_ids) < 1:
            return Response({"error": "حداقل یک علاقه‌مندی باید انتخاب شود"}, status=status.HTTP_400_BAD_REQUEST)

        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        valid_interests = InterestCategory.objects.filter(id__in=interest_ids)
        
        if valid_interests.count() == 0:
            return Response({"error": "علاقه‌مندی‌های ارسالی نامعتبر است"}, status=status.HTTP_400_BAD_REQUEST)

        profile.interests.set(valid_interests)

        if created or profile.xp == 0:
            profile.xp += 50
            profile.save()
            # TODO: واریز سکه/نور به کیف پول کاربر پس از ساخت اپلیکیشن Economy

        return Response({
            "message": "مسیر نورانی شما با موفقیت ساخته شد!",
            "xp_earned": profile.xp
        }, status=status.HTTP_200_OK)