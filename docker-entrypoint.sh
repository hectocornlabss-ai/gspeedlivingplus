#!/bin/sh
set -e

echo "======================================================="
echo "🚀 [GLP Entrypoint] Starting G-Speed Esport Arena System"
echo "======================================================="

# Ensure persistent data directories exist
mkdir -p /app/server/data/backups

# Start Node.js backend microservice (Port 3001) in background
echo "📦 [GLP Entrypoint] Starting Node.js backend on port 3001..."
cd /app/server
node email-service.js &
NODE_PID=$!

# Wait briefly for Node.js service to bind port 3001
sleep 1

# Graceful termination handler
trap "kill -TERM $NODE_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Start Nginx in foreground (Ports 80 & 3000)
echo "🌐 [GLP Entrypoint] Starting Nginx reverse proxy on ports 80/3000..."
exec nginx -g "daemon off;"
