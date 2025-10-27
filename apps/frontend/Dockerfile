# Multi-stage build for Traffic CRM Frontend
# Build stage only copies what's needed from monorepo

FROM node:20-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Copy root-level workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Pre-fetch dependencies to leverage pnpm's content-addressable store
RUN pnpm fetch --frozen-lockfile

# Copy entire project tree (needed for monorepo resolution)
COPY apps ./apps
COPY packages ./packages

# Install all dependencies (use offline after fetch; allow lockfile updates for CI consistency)
RUN pnpm install --offline

# Build only the frontend
RUN pnpm --filter ./apps/frontend build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY ./apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set permissions
RUN chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
