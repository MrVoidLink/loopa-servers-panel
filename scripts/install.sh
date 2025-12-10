#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR"
BACK_DIR="$ROOT_DIR/backend"

: "${PORT:=4000}"
: "${CORS_ORIGIN:=http://localhost:5173}"
: "${DATA_FILE:=data/app.json}"

need_command() {
  if command -v "$1" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

install_node_if_missing() {
  if need_command npm && need_command node; then
    return
  fi
  echo "[install] npm/node not found. Attempting apt-based install..."
  if need_command apt-get; then
    sudo apt-get update -y
    sudo apt-get install -y nodejs npm
  else
    echo "[install] apt-get not available. Please install Node.js >=18 manually, then re-run."
    exit 1
  fi
}

random_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    # fallback not cryptographically strong
    cat /proc/sys/kernel/random/uuid 2>/dev/null || date +%s%N
  fi
}

write_env() {
  local env_file="$1/.env"
  if [[ -f "$env_file" ]]; then
    echo "[install] .env already exists at $env_file; leaving as is."
    return
  fi
  local jwt_secret="${JWT_SECRET:-$(random_secret)}"
  cat >"$env_file" <<EOF
PORT=$PORT
CORS_ORIGIN=$CORS_ORIGIN
JWT_SECRET=$jwt_secret
DATA_FILE=$DATA_FILE
EOF
  echo "[install] wrote $env_file"
}

install_node_if_missing

echo "[install] installing frontend deps..."
cd "$FRONT_DIR"
npm install

echo "[install] building frontend..."
npm run build

echo "[install] installing backend deps..."
cd "$BACK_DIR"
npm install

write_env "$BACK_DIR"

echo "[install] building backend..."
npm run build

echo "[install] ensuring data directory..."
mkdir -p "$(dirname "$DATA_FILE")"
chmod 700 "$(dirname "$DATA_FILE")" 2>/dev/null || true

echo "[install] done. Backend start: cd backend && npm start (PORT=$PORT). Serve frontend dist/ with nginx or any static server; proxy /api to PORT."
