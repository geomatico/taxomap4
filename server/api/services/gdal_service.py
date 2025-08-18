import os

from django.conf import settings
from django.db import connections
from paramiko.client import MissingHostKeyPolicy, SSHClient


class GdalError(BaseException):
    def __init__(self, message, exit_code):
        super().__init__(message)
        self.exit_code = exit_code


def generate_arrow():
    _execute_gdal_ssh(_get_ogr_command())
    return os.path.join(settings.GDAL_ROOT, 'taxomap.arrow')


# noinspection PyTypeChecker
def _execute_gdal_ssh(command: str):
    client = SSHClient()
    try:
        client.set_missing_host_key_policy(_IgnorePolicy)
        client.connect(
            settings.GDAL_HOST, settings.GDAL_PORT,
            'geoprocessing', settings.GDAL_PASSWORD,
            allow_agent=False, look_for_keys=False
        )

        _, stdout, stderr = client.exec_command(command)
        exit_status = stdout.channel.recv_exit_status()
        if exit_status != 0:
            raise GdalError(f"command failed: {stderr.read().decode().strip().replace('\n', '---')}", exit_status)
    finally:
        client.close()


def _get_ogr_command() -> str:
    db_connection = connections['default'].settings_dict
    user = db_connection['USER']
    password = db_connection['PASSWORD']
    return (
        'ogr2ogr'
        ' -lco COMPRESSION=NONE'
        ' -lco BATCH_SIZE=999999'
        ' -sql '
        '"select id, catalognumber,'
        '        domain_id as domain,'
        '        kingdom_id as kingdom,'
        '        phylum_id as phylum,'
        '        class_id as class,'
        '        order_id as \\"order\\",'
        '        family_id as family,'
        '        genus_id as genus,'
        '        species_id as species,'
        '        subspecies_id as subspecies,'
        '        basisofrecord_id as basisofrecord,'
        '        institutioncode_id as institutioncode,'
        '        year,'
        '        geom'
        ' from taxomap"'
        ' -dialect OGRSQL'
        ' /gdal-outputs/taxomap.arrow'
        f' postgresql://{user}:{password}@taxomap-database/taxomap'
    )


class _IgnorePolicy(MissingHostKeyPolicy):
    def missing_host_key(self, client, hostname, key):
        pass
