# Etapa de construccion. El resultado util es dist/; el resto de esta etapa se descarta.
FROM node:24-alpine AS builder

WORKDIR /app

# Se copian primero los manifiestos para que la capa de dependencias solo se invalide cuando
# cambian, no en cada modificacion del codigo.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# El base path se inyecta en construccion porque Vite lo incrusta en los assets generados.
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}

RUN npm run build

# Etapa de produccion. No contiene Node, ni dependencias, ni codigo fuente: solo los archivos
# estaticos y el servidor que los sirve.
FROM nginx:1.29-alpine AS production

LABEL org.opencontainers.image.title="AppConecta"
LABEL org.opencontainers.image.description="Simulacion academica del portal del colaborador de AppConecta"
LABEL org.opencontainers.image.source="https://github.com/llipiterdev/appconecta-scm"
LABEL org.opencontainers.image.licenses="MIT"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

# La imagen se ejecuta sin privilegios de root. nginx:alpine incluye el usuario nginx.
USER nginx

CMD ["nginx", "-g", "daemon off;"]
