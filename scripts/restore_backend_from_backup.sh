#!/usr/bin/env bash
set -euo pipefail

# Restore backend from a backup produced by backup_backend_container.sh.
#
# This script:
#   1) Loads the saved Docker image tarball (image.<TS>.tar.gz)
#   2) Stops/removes an existing container (only if ALLOW_REPLACE=true)
#   3) Runs a new container using the loaded image and an env-file
#
# Usage:
#   ./restore_backend_from_backup.sh /path/to/backup/20260109T010203Z
#
# Common overrides:
#   CONTAINER_NAME=music-portfolio-backend ./restore_backend_from_backup.sh <backup_dir>
#   PORT_MAPPING=5000:5000 ./restore_backend_from_backup.sh <backup_dir>
#   ENV_FILE=/home/ubuntu/music-portfolio-backend/.env ./restore_backend_from_backup.sh <backup_dir>
#   ALLOW_REPLACE=true ./restore_backend_from_backup.sh <backup_dir>

BACKUP_DIR="${1:-}"
if [[ -z "$BACKUP_DIR" ]]; then
  echo "Usage: $0 <backup_dir>" >&2
  exit 1
fi

CONTAINER_NAME="${CONTAINER_NAME:-music-portfolio-backend}"
PORT_MAPPING="${PORT_MAPPING:-5000:5000}"
ALLOW_REPLACE="${ALLOW_REPLACE:-false}"

# Prefer .env captured in the backup; fall back to the deployed env path if provided.
DEFAULT_ENV_CANDIDATE="$BACKUP_DIR/.env"
ENV_FILE="${ENV_FILE:-$DEFAULT_ENV_CANDIDATE}"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERR] Missing required command: $1" >&2
    exit 1
  }
}

require_cmd docker
require_cmd gunzip
require_cmd ls

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "[ERR] Backup dir does not exist: $BACKUP_DIR" >&2
  exit 1
fi

IMAGE_TAR_GZ="$(ls -1 "$BACKUP_DIR"/image.*.tar.gz 2>/dev/null | head -n 1 || true)"
if [[ -z "$IMAGE_TAR_GZ" ]]; then
  echo "[ERR] Could not find image tarball in backup dir (expected image.<TS>.tar.gz): $BACKUP_DIR" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[ERR] Env file not found: $ENV_FILE" >&2
  echo "[INFO] You can pass ENV_FILE=/path/to/.env" >&2
  exit 1
fi

echo "[INFO] Restoring from: $BACKUP_DIR"
echo "[INFO] Loading image: $IMAGE_TAR_GZ"
LOAD_OUT="$(gunzip -c "$IMAGE_TAR_GZ" | docker load)"
echo "$LOAD_OUT"

# docker load prints: "Loaded image: <name>:<tag>"
IMAGE_REF="$(echo "$LOAD_OUT" | sed -n 's/^Loaded image: //p' | tail -n 1)"
if [[ -z "$IMAGE_REF" ]]; then
  echo "[ERR] Could not parse loaded image ref from docker load output." >&2
  exit 1
fi
echo "[INFO] Loaded image ref: $IMAGE_REF"

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  if [[ "$ALLOW_REPLACE" != "true" ]]; then
    echo "[ERR] Container already exists: $CONTAINER_NAME" >&2
    echo "[INFO] Re-run with ALLOW_REPLACE=true to stop/remove and replace it." >&2
    exit 1
  fi
  echo "[WARN] Replacing existing container: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
  docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true
fi

echo "[INFO] Starting container: $CONTAINER_NAME"
docker run -d --restart unless-stopped \
  --name "$CONTAINER_NAME" \
  -p "$PORT_MAPPING" \
  --env-file "$ENV_FILE" \
  "$IMAGE_REF" >/dev/null

echo "[SUCC] Restore complete."
docker ps --filter "name=$CONTAINER_NAME" --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'


