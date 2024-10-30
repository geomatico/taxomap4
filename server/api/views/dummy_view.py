from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet


class DummyView(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        return Response('holi')
