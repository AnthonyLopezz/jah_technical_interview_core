# Backend API Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY src ./src
COPY .env.example ./

# Build
RUN npm run build
RUN npm prune --omit=dev

# Run
EXPOSE 3000
CMD ["node", "dist/server.js"]