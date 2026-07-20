# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM docker.m.daocloud.io/library/node:20-alpine AS deps
# Use domestic mirrors for Alpine packages (China)
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files only (better layer caching)
COPY package.json package-lock.json* ./
# Install ALL dependencies (including devDependencies needed for build)
# Use domestic npm mirror (China)
RUN npm config set registry https://registry.npmmirror.com && npm ci

# ============================================================
# Stage 2: Build
# ============================================================
FROM docker.m.daocloud.io/library/node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================================
# Stage 3: Production Runtime
# ============================================================
FROM docker.m.daocloud.io/library/node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy JSON data files (runtime data used by Repository layer)
COPY --from=builder /app/data ./data

# Create upload directories for volume mounting
RUN mkdir -p /app/public/uploads/screenshots /app/public/uploads/videos /app/public/uploads/thumbnails

# Ensure correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
