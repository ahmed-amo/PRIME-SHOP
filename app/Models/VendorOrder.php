<?php

namespace App\Models;

use App\Models\Scopes\VendorScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorOrder extends Model
{
    protected $fillable = [
        'order_id',
        'vendor_id',
        'subtotal',
        'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new VendorScope);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
