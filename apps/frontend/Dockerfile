# Multi-stage build for Traffic CRM Frontend

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Enable pnpm via corepack
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy workspace manifests for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Pre-fetch dependencies to leverage pnpm's content-addressable store
RUN pnpm fetch --frozen-lockfile

# Copy the entire source code
COPY . .

# Install all dependencies using the cached store
RUN pnpm install --frozen-lockfile --offline

# Build the frontend application
RUN pnpm --filter ./apps/frontend... build

# Stage 2: Production
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configuration (from monorepo root context)
COPY ./apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of nginx directories
RUN chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown -R appuser:appgroup /var/run/nginx.pid

# Switch to the non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
