import logging
from typing import Optional

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.viewsets import ViewSet

from api.repositories.occurrence import Occurrence, OccurrenceRepository
from api.repositories.taxonomy import MissingGbifRank, NamesNotMatching, TaxonomyItem, TaxonomyRepository
from api.services.resources_service import generate_all_resources


class ManageView(ViewSet):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        operation_id='generateResources',
        responses={204: openapi.Response(description="Generated successfully.")})
    @action(methods=['POST'], detail=False, url_path='generate-resources')
    def generate_resources(self, request, *args, **kwargs):
        generate_all_resources()
        return Response(status=HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_id='matchGbif',
        responses={204: openapi.Response(description="Matched successfully.")})
    @action(methods=['POST'], detail=False, url_path='match-gbif')
    def match_gbif(self, request, *args, **kwargs):
        repository = OccurrenceRepository()
        for observation in repository.find_batch(limit=100000):
            logging.getLogger(self.__class__.__name__).info(f'Matching GBIF for observation: {observation.id}')
            try:
                match_observation(observation)
            except NamesNotMatching as e:
                observation.gbif_notes = (
                    f'Names not matching for rank "{e.item.rank.lower()}";'
                    f' expected "{e.expected_name}" but got "{e.item.canonical_name}"'
                )
                observation.is_visible = False
                repository.save(observation)
            except MissingGbifRank as e:
                observation.gbif_notes = f'Missing GBIF rank "{e.rank}" with name "{e.expected_name}"'
                observation.is_visible = False
                repository.save(observation)
        return Response(status=HTTP_204_NO_CONTENT)


def match_observation(occurrence: Occurrence):
    if occurrence.subspecies:
        tree = TaxonomyRepository().get_subspecies_tree(occurrence)
        _update_backbone_id(occurrence, tree.subspecies if tree else None)
    elif occurrence.species:
        tree = TaxonomyRepository().get_species_tree(occurrence)
        _update_backbone_id(occurrence, tree.species if tree else None)
    elif occurrence.genus:
        tree = TaxonomyRepository().get_genus_tree(occurrence)
        _update_backbone_id(occurrence, tree.genus if tree else None)
    elif occurrence.family:
        tree = TaxonomyRepository().get_family_tree(occurrence)
        _update_backbone_id(occurrence, tree.family if tree else None)
    elif occurrence.order:
        tree = TaxonomyRepository().get_order_tree(occurrence)
        _update_backbone_id(occurrence, tree.order if tree else None)
    elif occurrence.clazz:
        tree = TaxonomyRepository().get_class_tree(occurrence)
        _update_backbone_id(occurrence, tree.clazz if tree else None)
    elif occurrence.phylum:
        tree = TaxonomyRepository().get_phylum_tree(occurrence)
        _update_backbone_id(occurrence, tree.phylum if tree else None)
    logging.error(f'Cannot match observation: {occurrence.id}')


def _update_backbone_id(occurrence: Occurrence, taxonomy_item: Optional[TaxonomyItem]):
    if taxonomy_item is not None:
        occurrence.backbone_id = taxonomy_item.id
    else:
        occurrence.is_visible = False
        occurrence.gbif_notes = '¯\\_(ツ)_/¯ cannot find anything that looks similar in GBIF'
    OccurrenceRepository().save(occurrence)
