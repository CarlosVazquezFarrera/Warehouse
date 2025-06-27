# Etapa 1: Build de la app Angular
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build --configuration=production

# Etapa 2: Imagen de producción con Nginx
FROM nginx:alpine

# Copia el build al directorio público de Nginx
COPY --from=build /app/dist/warehouse/browser /usr/share/nginx/html

# (Opcional) Copia tu nginx.conf si tienes uno personalizado
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
