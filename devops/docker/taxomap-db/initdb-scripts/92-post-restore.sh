#!/bin/bash

psql --username ${TAXOMAP_USER} --dbname ${TAXOMAP_DB} -c "ANALYZE;"
