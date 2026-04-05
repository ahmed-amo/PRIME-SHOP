#!/bin/sh
set -e

# Writable dirs for Laravel + Spatie Media Library
if [ -d /var/www/html/storage ]; then
    mkdir -p \
        /var/www/html/storage/framework/sessions \
        /var/www/html/storage/framework/views \
        /var/www/html/storage/framework/cache \
        /var/www/html/storage/logs \
        /var/www/html/storage/app/public \
        /var/www/html/bootstrap/cache

    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
    chmod -R ug+rwx /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
fi

# Laravel setup
if [ -f /var/www/html/artisan ]; then
    cd /var/www/html

    # Storage symlink
    php artisan storage:link || true

    # Laravel caches for performance
    php artisan config:clear || true
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true

    # Run migrations safely (Railway friendly)
    php artisan migrate --force || true

    # Run seeders **once** (remove after first run)
    php artisan db:seed --force || true
fi

exec "$@"