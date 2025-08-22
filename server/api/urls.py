from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from geomatico_django.view import SimpleRouter

from api.views.manage_view import ManageView

schema_view = get_schema_view(
    openapi.Info(
        title="Taxomap API",
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
    path('auth/', include('api.auth.common.urls')),
    # path('upload-csv/', UploadCsvView.as_view(), name='upload_csv'),
]

router = SimpleRouter()
router.register('manage', ManageView, basename="manage"),
urlpatterns += router.urls
