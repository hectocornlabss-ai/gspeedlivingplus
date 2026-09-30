# Dockerfile for GLP Hostinger SMTP Email Service Microservice
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose microservice port
EXPOSE 3001

# Start microservice
CMD ["node", "email-service.js"]
