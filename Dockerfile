FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY astro.config.mjs ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
ENV ASTRO_TELEMETRY_DISABLED=1
RUN npm run build
FROM caddy:2-alpine
COPY hosting/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
