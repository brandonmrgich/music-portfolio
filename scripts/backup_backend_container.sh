#!/usr/bin/env bash
set -euo pipefail

# Backup the currently running backend container on the EC2 instance (steps 1–5).
# Produces:
#   - container.inspect.json
#   - container.logs.tail.txt
#   - optional copies of deployed .env and backend.tar.gz (if present)
#   - committed image tarball: image.<timestamp>.tar.gz
#   - optional exported filesystem tarball: containerfs.<timestamp>.tar.gz (enabled by default)
#
# Usage:
#   ./backup_backend_container.sh
#   CONTAINER_NAME=music-portfolio-backend ./backup_backend_container.sh
#   INCLUDE_EXPORT=false ./backup_backend_container.sh
#   BACKUP_ROOT=/home/ubuntu/backups ./backup_backend_container.sh

CONTAINER_NAME="${CONTAINER_NAME:-music-portfolio-backend}"
REMOTE_BACKEND_DIR="${REMOTE_BACKEND_DIR:-/home/ubuntu/music-portfolio-backend}"
BACKUP_ROOT="${BACKUP_ROOT:-/home/ubuntu/backups/music-portfolio-backend}"
TAIL_LOG_LINES="${TAIL_LOG_LINES:-2000}"
INCLUDE_EXPORT="${INCLUDE_EXPORT:-true}"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERR] Missing required command: $1" >&2
    exit 1
  }
}

require_cmd docker
require_cmd gzip
require_cmd date
require_cmd mkdir
require_cmd cp

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "[ERR] Container is not running: $CONTAINER_NAME" >&2
  echo "[INFO] Running containers:" >&2
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' >&2
  exit 1
fi

TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK="$BACKUP_ROOT/$TS"
mkdir -p "$BK"

echo "[INFO] Backing up container: $CONTAINER_NAME"
echo "[INFO] Timestamp: $TS"
echo "[INFO] Backup dir: $BK"

# Step 3: critical metadata
docker inspect "$CONTAINER_NAME" > "$BK/container.inspect.json"
docker logs --timestamps --tail "$TAIL_LOG_LINES" "$CONTAINER_NAME" > "$BK/container.logs.tail.txt"

cp -a "$REMOTE_BACKEND_DIR/.env" "$BK/.env" 2>/dev/null || true
cp -a "$REMOTE_BACKEND_DIR/backend.tar.gz" "$BK/backend.tar.gz" 2>/dev/null || true

# Step 4: snapshot running container into an image, then save it
IMAGE_BK="music-portfolio-backend:backup-$TS"
docker commit "$CONTAINER_NAME" "$IMAGE_BK" >/dev/null
docker save "$IMAGE_BK" | gzip > "$BK/image.$TS.tar.gz"

if [[ "$INCLUDE_EXPORT" == "true" ]]; then
  docker export "$CONTAINER_NAME" | gzip > "$BK/containerfs.$TS.tar.gz"
fi

# Step 5: verify
echo "[INFO] Backup contents:"
ls -lh "$BK"
gzip -t "$BK/image.$TS.tar.gz"

echo "[SUCC] Backup complete: $BK"


