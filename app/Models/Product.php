<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'vendor_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'compare_at_price',
        'sale_enabled',
        'sale_price',
        'sale_starts_at',
        'sale_ends_at',
        'stock',
        'sku',
        'status',
        'hero_sort_order',
        'image',
    ];

    protected $casts = [
        'price' => 'float',
        'compare_at_price' => 'decimal:2',
        'sale_enabled' => 'boolean',
        'sale_price' => 'decimal:2',
        'sale_starts_at' => 'datetime',
        'sale_ends_at' => 'datetime',
        'stock' => 'integer',
        'status' => 'boolean',
        'hero_sort_order' => 'integer',
    ];

    protected $appends = [
        'is_in_stock',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $base = Str::slug($product->name);
            $slug = $base;
            $n = 0;
            while (static::where('slug', $slug)->exists()) {
                $n++;
                $slug = $base.'-'.$n;
            }
            $product->slug = $slug;
        });
    }

    /**
     * Customer storefront: hide products whose vendor is suspended (legacy rows with no vendor still show).
     */
    public function scopeForPublicStorefront(Builder $query): Builder
    {
        $table = $query->getModel()->getTable();

        return $query->where(function (Builder $q) use ($table) {
            $q->whereNull($table.'.vendor_id')
                ->orWhereHas('vendor', function (Builder $v) {
                    $v->where('status', 'active');
                });
        });
    }

    /** Eager-load average rating + count for shop listings (avoids N+1). */
    public function scopeWithShopReviewStats(Builder $query): Builder
    {
        return $query->withAvg('reviews', 'rating')->withCount('reviews');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery');
    }

    /**
     * Prefer Spatie gallery media; fall back to legacy `image` column.
     * Paths under public/ (e.g. catpics/, producss/) use asset(); otherwise storage/.
     */
    public function galleryImageUrl(): ?string
    {
        return $this->galleryImageUrls()[0] ?? $this->legacyImageAssetUrl();
    }

    /**
     * Gallery URLs for storefront cards/details (max 5).
     *
     * @return array<int, string>
     */
    public function galleryImageUrls(int $max = 5): array
    {
        $max = max(1, min(10, $max));

        if ($this->relationLoaded('media') || $this->hasMedia('gallery')) {
            $urls = $this->getMedia('gallery')
                ->take($max)
                ->map(fn ($m) => $m->getUrl())
                ->filter(fn ($u) => is_string($u) && $u !== '' && $u !== '/')
                ->values()
                ->all();

            if (! empty($urls)) {
                return $urls;
            }
        }

        $legacy = $this->legacyImageAssetUrl();
        return $legacy ? [$legacy] : [];
    }

    protected function legacyImageAssetUrl(): ?string
    {
        if (! $this->image) {
            return null;
        }

        if (Str::startsWith($this->image, ['http://', 'https://'])) {
            return $this->image;
        }

        if (Str::startsWith($this->image, ['catpics/', 'producss/'])) {
            return asset($this->image);
        }

        return Storage::disk(config('filesystems.default'))->url($this->image);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scheduled sale (admin "Sales & Pricing" section) is active for current time.
     */
    public function saleScheduleActive(): bool
    {
        if (! $this->sale_enabled || $this->sale_price === null) {
            return false;
        }

        if ((float) $this->sale_price >= (float) $this->price) {
            return false;
        }

        $now = now();

        if ($this->sale_starts_at && $now->lt($this->sale_starts_at)) {
            return false;
        }

        if ($this->sale_ends_at && $now->gt($this->sale_ends_at)) {
            return false;
        }

        return true;
    }

    /** Legacy: compare_at_price higher than price (storefront pays `price`). */
    public function isOnSale(): bool
    {
        if ($this->compare_at_price === null) {
            return false;
        }

        return (float) $this->compare_at_price > (float) $this->price;
    }

    /**
     * Any effective promotion (scheduled sale OR legacy compare-at sale).
     */
    public function getIsSaleActiveAttribute(): bool
    {
        return $this->saleScheduleActive() || $this->isOnSale();
    }

    /**
     * Amount the customer pays right now.
     */
    public function getActivePriceAttribute(): float
    {
        if ($this->saleScheduleActive()) {
            return (float) $this->sale_price;
        }

        return (float) $this->price;
    }

    /**
     * Strikethrough / "was" price for storefront when a sale is active.
     */
    public function getOriginalDisplayPriceAttribute(): ?float
    {
        if ($this->saleScheduleActive()) {
            return (float) $this->price;
        }

        if ($this->isOnSale()) {
            return (float) $this->compare_at_price;
        }

        return null;
    }

    /** Alias for APIs / Inertia consistency. */
    public function getIsOnSaleEffectiveAttribute(): bool
    {
        return $this->is_sale_active;
    }

    /** Discount percent for badges (0 if not on sale). */
    public function getSaleDiscountPercentageAttribute(): int
    {
        if ($this->saleScheduleActive()) {
            $base = (float) $this->price;
            if ($base <= 0) {
                return 0;
            }

            return (int) round((($base - (float) $this->sale_price) / $base) * 100);
        }

        if (! $this->isOnSale()) {
            return 0;
        }

        $original = (float) $this->compare_at_price;
        $sale = (float) $this->price;
        if ($original <= 0) {
            return 0;
        }

        return (int) round((($original - $sale) / $original) * 100);
    }

    public function getIsInStockAttribute()
    {
        return $this->stock > 0;
    }

    private function shopReviewsCount(): int
    {
        if (array_key_exists('reviews_count', $this->attributes)) {
            return (int) $this->reviews_count;
        }

        if ($this->relationLoaded('reviews')) {
            return $this->reviews->count();
        }

        return (int) $this->reviews()->count();
    }

    private function shopRatingAverage(): float
    {
        if (array_key_exists('reviews_avg_rating', $this->attributes)) {
            $raw = $this->attributes['reviews_avg_rating'];
            if ($raw !== null && $raw !== '') {
                return round((float) $raw, 1);
            }

            return 0.0;
        }

        if ($this->relationLoaded('reviews') && $this->reviews->isNotEmpty()) {
            return round((float) $this->reviews->avg('rating'), 1);
        }

        $avg = $this->reviews()->avg('rating');

        return $avg !== null ? round((float) $avg, 1) : 0.0;
    }

    /**
     * Payload for shop listing / detail (Inertia + cart).
     *
     * @return array<string, mixed>
     */
    public function toShopFrontArray(): array
    {
        $images = $this->galleryImageUrls(5);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->active_price,
            'list_price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'original_display_price' => $this->original_display_price,
            'is_on_sale' => $this->is_sale_active,
            'is_on_sale_effective' => $this->is_sale_active,
            'discount_percentage' => $this->sale_discount_percentage,
            'stock' => (int) $this->stock,
            'in_stock' => $this->stock > 0,
            'category' => $this->category ? $this->category->name : null,
            'category_id' => $this->category_id,
            'rating' => $this->shopRatingAverage(),
            'reviews_count' => $this->shopReviewsCount(),
            'image' => $this->image,
            'image_url' => $this->galleryImageUrl(),
            'images' => $images,
            'sale_ends_at' => $this->saleScheduleActive() && $this->sale_ends_at
                ? $this->sale_ends_at->toIso8601String()
                : null,
            'sale_enabled' => (bool) $this->sale_enabled,
            'vendor_whatsapp_url' => $this->vendor?->whatsappClickUrl(),
        ];
    }

    /**
     * Home hero carousel slide (matches ShopBanner carousel shape).
     *
     * @return array<string, mixed>
     */
    public function toHeroSlideArray(int $visualIndex = 0): array
    {
        $shop = $this->toShopFrontArray();
        $desc = Str::limit(strip_tags((string) ($this->description ?? '')), 200);

        $alignments = ['left', 'right', 'left'];
        $overlays = [
            'from-white/80 to-white/40',
            'from-gray-100/80 to-gray-50/60',
            'from-amber-50/70 to-white/40',
        ];
        $i = $visualIndex % 3;

        $imageUrl = $shop['image_url'];
        if (! $imageUrl) {
            $imageUrl = 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80';
        }

        $formatDa = static fn (float $n): string => ((int) round($n)).' DA';

        $discountPct = (int) ($shop['discount_percentage'] ?? 0);
        if ($this->is_sale_active && $discountPct > 0) {
            $badge = 'SALE · '.$discountPct.'% OFF';
        } elseif ($this->is_sale_active) {
            $badge = 'ON SALE';
        } elseif ($this->stock <= 10 && $this->stock > 0) {
            $badge = 'LOW STOCK';
        } else {
            $badge = 'FEATURED';
        }

        return [
            'id' => $this->id,
            'title' => $this->name,
            'subtitle' => $this->category?->name ?? 'Prime Shop',
            'description' => $desc !== '' ? $desc : 'Discover this product in our catalog.',
            'buttonText' => 'View product',
            'secondaryButtonText' => 'All products',
            'buttonLink' => '/product/'.$this->slug,
            'secondaryButtonLink' => '/products',
            'imageSrc' => $imageUrl,
            'mobileImageSrc' => $imageUrl,
            'textColor' => 'text-gray-900',
            'overlayColor' => $overlays[$i],
            'alignment' => $alignments[$i],
            'badge' => $badge,
            'price' => $formatDa((float) $shop['price']),
            'originalPrice' => isset($shop['original_display_price']) && $shop['original_display_price'] !== null
                ? $formatDa((float) $shop['original_display_price'])
                : null,
            'discount' => $discountPct > 0 ? $discountPct : null,
        ];
    }
}
