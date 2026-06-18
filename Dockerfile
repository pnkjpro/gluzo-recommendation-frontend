# Build stage
FROM node:20-alpine AS build-stage
WORKDIR /app

# Accept API URL as a build argument (baked into the JS bundle at build time)
ARG VITE_API_URL=http://localhost:8000/api
ARG VITE_BASE_API=http://localhost:8000
ARG VITE_APP_NAME=Gluzo

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_API=$VITE_BASE_API
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy package files first (for Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files and build for production
COPY . .
RUN npm run build:prod

# Production stage — serve with Nginx
FROM nginx:alpine AS production-stage

# Copy the built assets (vite.config.js outputs to dist-prod in production mode)
COPY --from=build-stage /app/dist-prod /usr/share/nginx/html

# Nginx config for Vue Router SPA (prevents 404 on page refresh)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — all routes served by index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
