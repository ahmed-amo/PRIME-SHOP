<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

/**
 * Cache key + invalidation for the shop home Inertia payload.
 * Uses the app default cache store (set CACHE_STORE=redis in .env to use Redis).
 */
final class ShopHomeCache
{
    public const KEY = 'shop.home.index';

    public static function forget(): void
    {
        Cache::forget(self::KEY);
    }
}
