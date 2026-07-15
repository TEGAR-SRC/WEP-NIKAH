FROM node:22-alpine AS base

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN npm install -g tsx && \
    npx prisma generate && \
    mkdir -p wa_session && \
    chown -R nextjs:nodejs wa_session /app

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs
COPY scripts/start.sh ./start.sh
RUN chmod +x start.sh
CMD ["sh", "start.sh"]
