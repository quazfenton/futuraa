# Use Node.js LTS as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install all dependencies for build
RUN npm install -g npm@latest
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files from builder
COPY package*.json ./
COPY bun.lockb ./

# Install only production dependencies
RUN npm install -g npm@latest
RUN npm ci --only=production

# Copy built assets and server file from builder stage
COPY --from=builder /app/dist ./dist
COPY server.js .

# Expose port for Cloud Run
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]