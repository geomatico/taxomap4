import os
from pathlib import Path

from django.db.migrations import Migration

from api import migrations


class ConditionalMigration(Migration):
    condition = True

    def apply(self, project_state, schema_editor, collect_sql=False):
        if self.condition is False:
            return project_state
        return super().apply(project_state, schema_editor, collect_sql)


def get_script_sql(filename: str) -> str:
    migrations_dir = Path(migrations.__file__).parent
    with open(os.path.join(migrations_dir, filename), 'r') as file:
        return file.read()
