from django.urls import path
from .views import SubmitInterestsView, InterestListView

urlpatterns = [
    path('interests/', InterestListView.as_view(), name='api-interest-list'),
    path('submit-interests/', SubmitInterestsView.as_view(), name='api-submit-interests'),
]