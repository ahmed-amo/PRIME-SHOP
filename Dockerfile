# Stage 1 — Build frontend assets
FROM node:24-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm ci

COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.ts ./ 
COPY tsconfig.json* ./ 

RUN npm run build -- --outDir=public/build

# Stage 2 — Install PHP dependencies
FROM php:8.4-alpine AS vendor

WORKDIR /app

RUN apk add --no-cache libzip-dev \
    && docker-php-ext-install exif zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-scripts

# Stage 3 — Production image
FROM php:8.4-fpm-alpine AS production

WORKDIR /var/www/html

RUN apk add --no-cache \
    nginx supervisor postgresql-client libpq-dev libzip-dev zip unzip \
    freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev \
    autoconf g++ make \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip opcache gd exif bcmath \
    && pecl install redis && docker-php-ext-enable redis \
    && apk del autoconf g++ make && rm -rf /var/cache/apk/* /tmp/pear

# Copy vendor & built frontend
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Copy full source
COPY . .

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Nginx + Supervisor configs
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
