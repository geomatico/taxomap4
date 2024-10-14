from geomatico_django.view import EntityViewDecorators
from rest_framework.request import Request
from rest_framework.viewsets import ViewSet

from api.dto.otter_serializer import OtterDto, OtterSerializer
from api.filters.get_otters_filter import GetOttersFilter
from api.repositories.otter import OtterRepository
from api.use_cases import otter_use_cases as use_cases

entity_view = EntityViewDecorators(OtterRepository, serializer=OtterSerializer, use_cases=use_cases, entity_id_type=str)


class OtterView(ViewSet):
    @entity_view.get('getOtters', filter=GetOttersFilter)
    def list(self, request: Request, filters: GetOttersFilter = None):
        return use_cases.get_otters()

    @entity_view.get_by_id('getOtterById')
    def retrieve(self, request, slug: str):
        return use_cases.get_by_id(slug)

    @entity_view.post('createOtters')
    def create(self, request: Request, dto: OtterDto):
        return use_cases.create_otter(dto)

    @entity_view.put('replaceOtter')
    def update(self, request: Request, slug: str, dto: OtterDto = None):
        return use_cases.update_otter(slug, dto)

    @entity_view.patch('updateOtter')
    def partial_update(self, request: Request, slug: str, dto: OtterDto = None):
        return use_cases.update_otter(slug, dto)

    @entity_view.delete('deleteOtter')
    def destroy(self, request: Request, slug: str):
        return use_cases.delete_otter(slug)
