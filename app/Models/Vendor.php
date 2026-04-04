<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    protected $fillable = [
        'user_id',
        'shop_name',
        'slug',
        'logo',
        'description',
        'phone',
        'phone_country_dial',
        'address',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function vendorOrders(): HasMany
    {
        return $this->hasMany(VendorOrder::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** WhatsApp click-to-chat URL (digits only, no +). Null if no phone. */
    public function whatsappClickUrl(): ?string
    {
        $national = preg_replace('/\D/', '', (string) ($this->phone ?? ''));
        if ($national === '') {
            return null;
        }

        $dial = preg_replace('/\D/', '', (string) ($this->phone_country_dial ?? '213'));
        if ($dial === '') {
            $dial = '213';
        }

        return 'https://wa.me/'.$dial.$national;
    }
}
