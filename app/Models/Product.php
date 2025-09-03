<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'old_price',
        'rating',
        'review_count',
        'stock',
        'image',
        'gallery',
        'colors',
        'sizes',
        'is_featured',
        'is_active',
    ];
    protected $casts = [
        'colors'=>'array',
        'original_price'=>'decimal:2',
        'price'=>'decimal:2',
        'rating'=>'decimal1',
     ];
        
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function scopeSimilaire($query,$productId){
        $product = static::FirstOrFail($productId);
        return  $query ->where('category_id',$product->category_id)->where('id','!=',$product);
    }
}
