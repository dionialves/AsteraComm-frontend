# =============================================================================
# AsteraComm Frontend - Dockerfile de Produção (Multi-stage Build)
# =============================================================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime (imagem limpa, apenas artefatos de produção)
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
