# STAGE 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source and build the application
COPY . .
RUN npm run build

# STAGE 2: Run
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only the necessary build artifacts from the build stage
# Angular 20 output structure: dist/<project-name>/[browser|server]
COPY --from=build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# The server entry point in Angular 20 is typically server.mjs
# Replace <your-project-name> with the name from your angular.json
EXPOSE 4000
CMD ["node", "dist/lister/server/server.mjs"]