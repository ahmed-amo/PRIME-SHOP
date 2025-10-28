<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable =[
        'name',
        'slug',
        'description',
        'image',
        'color',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

// protected $appends = ['products_count'];

//     public function products(): HasMany
// {
//     return $this->hasMany(Product::class);
// }
// public function getProductsCountAttribute(): int
// {
//     return $this->products()->count();
// }


}
