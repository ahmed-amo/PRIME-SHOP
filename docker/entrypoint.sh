#!/bin/sh
set -e

# 1. Setup Directories
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

    # CRITICAL: Clear cache so artisan sees the DB_HOST from Railway env
    php artisan config:clear
    php artisan cache:clear

    # Run migrations
    echo "Starting migrations..."
    php artisan migrate --force

    # Run seeders WITHOUT '|| true' so we can see errors in Railway logs
    echo "Starting seeders..."
    php artisan db:seed --force

    # Now cache for performance
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi
exec "$@"