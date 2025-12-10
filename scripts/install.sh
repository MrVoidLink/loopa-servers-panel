#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR"
BACK_DIR="$ROOT_DIR/backend"

: "${PORT:=4000}"
: "${CORS_ORIGIN:=http://localhost:5173}"
: "${FRONT_PORT:=4173}"
: "${DATA_FILE:=data/app.json}"
: "${RUN_AS_USER:=$(id -un)}"

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

ensure_node_version() {
  if ! need_command node; then
    return
  fi
  node_version="$(node -v | sed 's/^v//')"
  node_major="${node_version%%.*}"
  if [[ "${node_major}" -ge 20 ]]; then
    return
  fi
  echo "[install] Node ${node_version} detected (<20). Attempting Node 20 via NodeSource..."
  if need_command curl && need_command apt-get; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "[install] Cannot auto-upgrade Node (need curl + apt-get). Please install Node 20+ manually."
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
ensure_node_version

echo "[install] installing frontend deps..."
cd "$FRONT_DIR"
npm install

echo "[install] building frontend..."
npm run build

echo "[install] installing static server (serve)..."
if ! command -v serve >/dev/null 2>&1; then
  npm install -g serve
fi
SERVE_BIN="$(command -v serve || echo serve)"

echo "[install] installing backend deps..."
cd "$BACK_DIR"
npm install

write_env "$BACK_DIR"

echo "[install] building backend..."
npm run build

echo "[install] ensuring data directory..."
mkdir -p "$(dirname "$DATA_FILE")"
chmod 700 "$(dirname "$DATA_FILE")" 2>/dev/null || true

backend_port="$PORT"
if [[ -f "$BACK_DIR/.env" ]]; then
  env_port="$(grep -E '^PORT=' "$BACK_DIR/.env" | tail -n1 | cut -d'=' -f2)"
  if [[ -n "$env_port" ]]; then
    backend_port="$env_port"
  fi
fi

frontend_path="$FRONT_DIR/dist"

maybe_systemd=0
if command -v systemctl >/dev/null 2>&1; then
  maybe_systemd=1
fi

backend_unit="/etc/systemd/system/loopa-backend.service"
frontend_unit="/etc/systemd/system/loopa-frontend.service"

if [[ "$maybe_systemd" -eq 1 ]] && [[ "$EUID" -eq 0 ]]; then
  echo "[install] creating systemd service for backend..."
  cat >"$backend_unit" <<EOF
[Unit]
Description=Loopa Backend
After=network.target

[Service]
Type=simple
User=$RUN_AS_USER
WorkingDirectory=$BACK_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/env bash -c 'cd "$BACK_DIR" && npm start'
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

  echo "[install] creating systemd service for frontend (serve -s dist)..."
  cat >"$frontend_unit" <<EOF
[Unit]
Description=Loopa Frontend (serve)
After=network.target

[Service]
Type=simple
User=$RUN_AS_USER
WorkingDirectory=$FRONT_DIR
ExecStart=/usr/bin/env bash -c 'cd "$FRONT_DIR" && ${SERVE_BIN} -s "$frontend_path" -l $FRONT_PORT'
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable loopa-backend.service
  systemctl enable loopa-frontend.service
  systemctl restart loopa-backend.service
  systemctl restart loopa-frontend.service
else
  echo "[install] systemd not available or not running as root; starting with nohup..."
  cd "$BACK_DIR"
  nohup npm start >/tmp/loopa-backend.log 2>&1 &
  backend_pid=$!

  echo "[install] starting frontend static server..."
  cd "$FRONT_DIR"
  nohup serve -s "$frontend_path" -l "$FRONT_PORT" >/tmp/loopa-frontend.log 2>&1 &
  frontend_pid=$!
fi

echo ""
echo "[install] summary"
printf -- '---------------------------------------------------------------------\n'
printf '%-12s | %-12s | %-10s | %-30s\n' "Service" "Status" "Port" "Info / URL"
printf -- '---------------------------------------------------------------------\n'
printf '%-12s | %-12s | %-10s | %-30s\n' "frontend" "running" "$FRONT_PORT" "http://<server-ip>:${FRONT_PORT}"
printf '%-12s | %-12s | %-10s | %-30s\n' "backend" "running" "$backend_port" "http://<server-ip>:${backend_port}"
printf '%-12s | %-12s | %-10s | %-30s\n' "health" "ready" "$backend_port" "curl http://<server-ip>:${backend_port}/health"
printf -- '---------------------------------------------------------------------\n'
if [[ "$maybe_systemd" -eq 1 && "$EUID" -eq 0 ]]; then
  echo "[install] services: systemctl status loopa-backend loopa-frontend"
else
  echo "[install] backend pid: ${backend_pid:-manual} (logs: /tmp/loopa-backend.log)"
  echo "[install] frontend pid: ${frontend_pid:-manual} (logs: /tmp/loopa-frontend.log)"
fi
echo "[install] done. Frontend: http://<server-ip>:${FRONT_PORT} | Backend: http://<server-ip>:${backend_port}"
