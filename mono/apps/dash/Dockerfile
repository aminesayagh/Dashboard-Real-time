# Dockerfile for the Dash service

# Stage 1: Build the shared library and the Dash service
FROM node:18-alpine AS build

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy the shared library
COPY apps/libs/shared-ts/package.json ./apps/libs/shared-ts/

# Copy the Dash package.json
COPY apps/dash/package.json ./apps/dash/

# Recursively install dependencies
RUN pnpm install --recursive --frozen-lockfile 

COPY . .

# Build the shared library
RUN pnpm --filter shared-ts build

# Build the Dash app
RUN pnpm --filter dash build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and package.json files
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/apps/libs/shared-ts ./apps/libs/shared-ts
COPY --from=build /app/apps/dash ./apps/dash

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --recursive --prod --frozen-lockfile

# Expose the port the Dash app runs on
EXPOSE 3000

# Command to run the Dash app
CMD ["pnpm", "--filter", "dash", "start"]