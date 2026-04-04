<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'phone_country_dial',
        'picture',
        'avatar',
        'address',
        'role',
        'google_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }
    // app/Models/User.php

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /** Profile photo for headers and review cards: uploaded picture wins, then OAuth avatar URL. */
    public function avatarDisplayUrl(): ?string
    {
        if ($this->picture) {
            if (str_starts_with((string) $this->picture, 'http')) {
                return $this->picture;
            }

            return asset('storage/'.$this->picture);
        }

        if ($this->avatar && str_starts_with((string) $this->avatar, 'http')) {
            return $this->avatar;
        }

        return null;
    }

    public function vendor(): HasOne
    {
        return $this->hasOne(Vendor::class);
    }

    public function isVendor(): bool
    {
        return $this->vendor()->exists();
    }

    public function getRedirectRoute(): string
    {
        return $this->isAdmin() ? route('admin.dashboard') : '/home';
    }
}
