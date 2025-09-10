from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet

from api.services.resources_service import generate_all_resources


class ManageView(ViewSet):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_id='generateResources',
        responses={204: openapi.Response(description="Generated successfully.")})
    @action(methods=['POST'], detail=False, url_path='generate-resources')
    # not transactional; we need django to persist some data regarding gbif ancestors,
    # so the gdal container can generate the arrow file within this endpoint
    def generate_resources(self, request, *args, **kwargs):
        generate_all_resources()
        return Response(status=HTTP_204_NO_CONTENT)
