#!/bin/bash
set -e

DIR="$(dirname "$(readlink -f "$0")")"

echo "[INFO] Cleaning previous data dir..."
rm -rf "$DIR/data"
mkdir -p "$DIR/data"

echo "[INFO] Preparing GBIF data..."
if [ ! -f "$DIR/gbif-backbone.txt" ]; then
  wget https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28/simple.txt.gz -O "$DIR/gbif-backbone.txt.gz"
  gunzip "$DIR/gbif-backbone.txt.gz"
fi

echo "[INFO] Starting database container..."
docker compose -f "${DIR}/docker-compose.yml" down
docker compose -f "${DIR}/docker-compose.yml" build
docker compose -f "${DIR}/docker-compose.yml" up --wait

echo "[INFO] Preparing dump in ${TARGET_DUMP}..."
for script in "$DIR"/scripts/*; do
  PGPASSWORD=taxomap psql -h localhost -U taxomap -p 54321 -f "$script"
done
sudo chown -R $USER: data

#echo "[INFO] Stopping database container..."
#docker compose down --rmi local
