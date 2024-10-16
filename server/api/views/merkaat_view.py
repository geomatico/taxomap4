from uuid import UUID

from geomatico_django.view import EntityViewDecorators
from rest_framework.request import Request
from rest_framework.views import APIView

from api.dto.merkaat_serializer import MerkaatDto, MerkaatSerializer
from api.filters.get_merkaats_filter import GetMerkaatsFilter
from api.use_cases import merkaat_use_cases as use_cases

entity_view = EntityViewDecorators(None, serializer=MerkaatSerializer, use_cases=use_cases, entity_id_type=UUID)


class MerkaatView(APIView):
    @entity_view.get('getMerkaats', filter=GetMerkaatsFilter)
    def get(self, request: Request, filters: GetMerkaatsFilter = None):
        return use_cases.get_merkaats(filters.get_uuids())

    @entity_view.post('createMerkaats')
    def post(self, request: Request, dto: MerkaatDto):
        return use_cases.create_merkaat(dto)


class MerkaatViewById(APIView):
    @entity_view.get_by_id('getMerkaatById')
    def get(self, request, uuid: UUID):
        return use_cases.get_by_id(uuid)

    @entity_view.put('replaceMerkaat')
    def put(self, request: Request, uuid: UUID, dto: MerkaatDto = None):
        return use_cases.update_merkaat(uuid, dto)

    @entity_view.patch('updateMerkaat')
    def patch(self, request: Request, uuid: UUID, dto: MerkaatDto = None):
        return use_cases.update_merkaat(uuid, dto)

    @entity_view.delete('deleteMerkaat')
    def delete(self, request: Request, uuid: UUID):
        return use_cases.delete_merkaat(uuid)
