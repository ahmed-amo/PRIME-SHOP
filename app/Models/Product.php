<?php

namespace App\Models;



use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'original_price',
        'discount_price',
        'discount_percentage',
        'image',
        'images',
        'rating',
        'reviews_count',
        'stock',
        'is_new',
        'is_featured',
        'status',
        'sku',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'stock' => 'integer',
        'is_new' => 'boolean',
        'is_featured' => 'boolean',
        'status' => 'boolean',
        'images' => 'array',
        'meta_keywords' => 'array',
    ];

    protected $appends = [
        'final_price',
        'savings',
        'is_in_stock',
        'is_low_stock',
    ];



}
