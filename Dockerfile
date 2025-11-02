# Build stage: use node to install deps and build the Vite app
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies needed to build
# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY pnpm-lock.yaml ./
# If you use yarn.lock or bun.lockb, rename the file here (remove pnpm lines above)
# COPY yarn.lock ./
# COPY bun.lockb ./

# Install dependencies (detect package manager)
# If you use pnpm, replace with pnpm install --frozen-lockfile
RUN apk add --no-cache python3 make g++ || true

# Use npm ci for reproducible install
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# Production stage: serve built static files with nginx
FROM nginx:stable-alpine AS production

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx to listen on $PORT for Cloud Run (default 8080)
# Replace the default conf with one that reads PORT env var
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
