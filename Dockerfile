# Multi-Stage Dockerfile for G-Speed Esport Arena (Coolify & Standalone Production)

# ==========================================
# Stage 1: Build Phase (Frontend Vite SPA)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอก package.json เพื่อแคช Docker Layer dependencies
COPY package*.json ./

# ติดตั้ง dependencies ให้ครบถ้วน
RUN npm ci

# คัดลอก Source Code ทั้งหมด
COPY . .

# สร้าง Production Bundle สำหรับ Deploy
RUN npm run build

# ==========================================
# Stage 2: Production Server (Nginx + Node.js Backend Microservice)
# ==========================================
FROM nginx:alpine AS runner

# ติดตั้ง Node.js และ npm บน Alpine Linux
RUN apk add --no-cache nodejs npm

WORKDIR /app

# คัดลอก dependencies และติดตั้ง production dependencies ของ Backend Server
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# คัดลอก Backend Code และ Default Metadata
COPY server/ ./server/

# คัดลอก static build จาก builder stage ไปยัง Nginx Web Root
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกรูปภาพเริ่มต้นไปยัง data uploads ของ Backend เพื่อให้ทั้ง Nginx และ Backend มีรูปภาพครบถ้วน 100%
RUN mkdir -p /app/server/data/uploads
COPY --from=builder /app/public/uploads /app/server/data/uploads

# คัดลอกการตั้งค่า Nginx (Reverse Proxy & Clean Path URLs & Crawler SSR)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Persistent Volume สำหรับเก็บฐานข้อมูล CMS Site Data และรูปภาพข้ามการ Deploy
VOLUME ["/app/server/data"]

ENV DATA_DIR=/app/server/data
ENV BACKEND_PORT=3001

# เปิดพอร์ต 80 และ 3000 (รองรับทั้ง Nginx มาตรฐานและ Coolify default)
EXPOSE 80 3000

# เริ่มการทำงานของ Node.js Backend พร้อม Supervisor Auto-Restart และ Nginx อย่างปลอดภัย
CMD ["/bin/sh", "-c", "mkdir -p /app/server/data/backups /app/server/data/uploads && (while true; do node /app/server/email-service.js; echo '[Supervisor] Node.js exited, restarting in 2s...'; sleep 2; done) & exec nginx -g 'daemon off;'"]
