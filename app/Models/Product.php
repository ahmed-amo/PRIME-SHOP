<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Product extends Model
{


    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'sku',
        'status',
        'image',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'status' => 'boolean',
    ];

    protected $appends = [
        'is_in_stock',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $product->slug = Str::slug($product->name);
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getIsInStockAttribute()
    {
        return $this->stock > 0;
    }
}
