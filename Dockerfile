FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
# If you use Bun and have bun.lockb, keep the next line; otherwise remove it
COPY bun.lockb ./

# Install all dependencies for build
RUN npm install -g npm@latest && \
    npm ci

# Copy source code
COPY . .

# Build the application (requires "build" script in package.json)
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files from builder
COPY package*.json ./
# If you use Bun and have bun.lockb, keep the next line; otherwise remove it
COPY bun.lockb ./

# Install only production dependencies (node v20+ supports --omit=dev)
RUN npm install -g npm@latest && \
    npm ci --omit=dev

# Copy built assets and production server from builder stage
COPY --from=builder /app/dist ./dist
# copy server entry from builder to preserve built files or transpiled server file
COPY --from=builder /app/server.js ./server.js

# Ensure the process runs as non-root where possible (optional)
# create app user and set ownership (commented out if incompatible with runtime)
# RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
# USER app

# Expose port for Cloud Run (Cloud Run listens on $PORT but default is 8080)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
