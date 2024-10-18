from django.conf import settings
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from api.auth.common.view import DebugResetEmailView, DebugResetPasswordView, DebugUserActivationView
from api.views.users_view import TaxomapUsersViewSet

urlpatterns = [
    re_path("^", include('djoser.urls.jwt'))
]

router = DefaultRouter()
# TODO parametrize
router.register("users", TaxomapUsersViewSet)
urlpatterns += router.urls

if settings.DEBUG:
    # to test activation/confirmation urls in emails without a frontend handling it
    urlpatterns.append(path('activate/<str:uid>/<str:token>', DebugUserActivationView.as_view()))
    urlpatterns.append(path('reset-password/<str:uid>/<str:token>', DebugResetPasswordView.as_view()))
    urlpatterns.append(path('reset-email/<str:uid>/<str:token>', DebugResetEmailView.as_view()))
