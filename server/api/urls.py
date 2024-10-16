from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from geomatico_django.view import SimpleRouter

from api.views.merkaat_view import MerkaatView, MerkaatViewById
from api.views.otter_view import OtterView

schema_view = get_schema_view(
    openapi.Info(
        title="Marmot API",
        default_version="v1",
        contact=openapi.Contact(email="info@geomatico.es"),
    ),
    public=True,
)

urlpatterns = [
    # swagger
    path(
        "apidocs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("merkaats/", MerkaatView.as_view(), name="merkaats"),
    path("merkaats/<str:uuid>", MerkaatViewById.as_view(), name="merkaats-by-id"),
]

router = SimpleRouter()
router.register('otters', OtterView, basename='otters')
urlpatterns += router.urls
