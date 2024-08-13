# Dockerfile for the API service

# Stage 1: Build the shared library and the API service
FROM node:18-alpine AS build

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy  package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy the shared library
COPY apps/libs/shared-ts ./apps/libs/shared-ts 

# Copy the API application
COPY apps/api ./apps/api

# Install dependencies, --frozen-lockfile ensures that the lockfile is not updated
RUN pnpm install --recursive --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the shared library
RUN pnpm --filter shared-ts build

# Build the API (if necessary)
RUN pnpm --filter api build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and package.json files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/libs/shared-ts ./apps/libs/shared-ts
COPY --from=builder /app/apps/api ./apps/api

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --recursive --prod --frozen-lockfile

# Expose the port the API runs on
EXPOSE 3001

# Command to run the API
CMD ["pnpm", "--filter", "api", "start"]