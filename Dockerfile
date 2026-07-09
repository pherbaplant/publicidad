# Imagen simple (no usa `next build` standalone) para máxima compatibilidad
# con better-sqlite3, que necesita compilar un addon nativo si no hay un
# binario precompilado para la plataforma de destino.
FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# `npm run start` corre `prisma migrate deploy` antes de levantar el server,
# así que las migraciones se aplican contra el disco persistente en cada
# arranque del contenedor (idempotente).
CMD ["npm", "run", "start"]
