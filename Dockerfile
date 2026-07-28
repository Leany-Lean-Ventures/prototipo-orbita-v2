# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
FROM node:24-alpine AS build

WORKDIR /app

# Instala dependências primeiro (camada cacheada enquanto o lockfile não muda)
COPY package.json package-lock.json ./
RUN npm ci

# Código-fonte e configs de build
COPY . .

# Build de produção do Vite -> /app/dist
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginx:1.27-alpine AS runtime

# Config de SPA (fallback para index.html + cache de assets)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefatos estáticos do build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
