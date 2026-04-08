#!/bin/sh
set -e

# 1. Setup directories
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

# 2. Laravel setup
if [ -f /var/www/html/artisan ]; then
    cd /var/www/html

    # Clear any config cache baked into the image during Docker build so that
    # runtime environment variables (e.g. APP_NAME) are picked up correctly
    # when the cache is rebuilt below.
    php artisan config:clear || true

    # Storage symlink
    php artisan storage:link --force || true

    # Run migrations (safe — skips already-ran migrations)
    echo "Running migrations..."
    php artisan migrate --force || true

    # Seed only if database is empty (checks if products table has no rows)
    PRODUCT_COUNT=$(php artisan tinker --execute="echo \App\Models\Product::count();" 2>/dev/null | tr -d '[:space:]')
    if [ "$PRODUCT_COUNT" = "0" ] || [ -z "$PRODUCT_COUNT" ]; then
        echo "Database is empty — running seeders..."
        php artisan db:seed --force || true
    else
        echo "Database already has data — skipping seeders."
    fi

    # Laravel caches for performance
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

exec "$@"