import json
import logging
import os
import shutil
from pathlib import Path
from typing import Iterable

from django.conf import settings

from api.repositories.basis_of_record import BasisOfRecordRepository
from api.repositories.institution import InstitutionRepository
from api.repositories.occurrence import OccurrenceRepository
from api.repositories.taxonomy import TaxonomyRepository
from api.services import gdal_service
from api.services.mixins import DictionaryMixin

_DICTIONARIES_DIR = os.path.join(settings.STATIC_ROOT, 'dictionaries')


def generate_all_resources():
    occurrence_repository = OccurrenceRepository()
    taxonomy_repository = TaxonomyRepository()

    try:
        for backbone_id in occurrence_repository.find_distinct_backbone_ids():
            taxonomy_repository.update_backbone_id_with_ancestors(backbone_id)
        generate_dictionaries()
        generate_arrow()
    except BaseException as e:
        logging.getLogger(__name__).error('Cannot generate resources', exc_info=True)
        raise RuntimeError('Cannot generate resources') from e


def generate_dictionaries():
    repository = TaxonomyRepository()
    _update_json('domain.json', repository.get_domains())
    _update_json('kingdom.json', repository.get_kingdoms())
    _update_json('phylum.json', repository.get_phyla())
    _update_json('class.json', repository.get_classes())
    _update_json('order.json', repository.get_orders())
    _update_json('family.json', repository.get_families())
    _update_json('genus.json', repository.get_genera())
    _update_json('species.json', repository.get_species())
    _update_json('subspecies.json', repository.get_subspecies())
    _update_json('basisofrecord.json', BasisOfRecordRepository().find_all())
    _update_json('institutioncode.json', InstitutionRepository().find_all())


def generate_arrow():
    src = gdal_service.generate_arrow()
    dest = os.path.join(settings.STATIC_ROOT, 'taxomap.arrow')
    if os.path.exists(dest):
        shutil.move(dest, f'{dest}.bak')
    shutil.copy(src, dest)


def _update_json(filename: str, items: Iterable[DictionaryMixin]):
    Path(_DICTIONARIES_DIR).mkdir(parents=True, exist_ok=True)
    dest = os.path.join(_DICTIONARIES_DIR, filename)
    if os.path.exists(dest):
        shutil.move(dest, f'{dest}.bak')

    items = sorted([item for item in items if item], key=lambda item: item.id)
    with open(dest, 'w') as output:
        output.write('[\n')
        output.write(',\n'.join(json.dumps(item.to_dict(), ensure_ascii=False) for item in items))
        output.write('\n]')
