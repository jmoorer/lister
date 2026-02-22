# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder /app /app
USER nodejs
EXPOSE 8080
CMD ["node", "dist/lister/server/server.mjs"]