# Multi-Stage Dockerfile for G-Speed Esport Arena (Coolify Optimized)

# ==========================================
# Stage 1: Build Phase
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
# Stage 2: Production Web Server Phase (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# คัดลอกการตั้งค่า Nginx ที่ปรับแต่งเพื่อ Clean Path URLs & Caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ static build จาก builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# เปิดพอร์ต 80 (พอร์ตมาตรฐานสำหรับ Coolify Reverse Proxy)
EXPOSE 80

# สั่งเริ่มการทำงานของ Nginx
CMD ["nginx", "-g", "daemon off;"]
