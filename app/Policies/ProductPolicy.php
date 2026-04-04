<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    protected function adminLike(User $user): bool
    {
        return $user->hasRole('super_admin') || $user->isAdmin();
    }

    public function viewAny(User $user): bool
    {
        return $this->adminLike($user) || $user->hasRole(['vendor_admin', 'vendor_staff']);
    }

    public function view(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }

    public function create(User $user): bool
    {
        if ($this->adminLike($user)) {
            return true;
        }

        if (! $user->hasRole(['vendor_admin', 'vendor_staff']) || $user->vendor === null) {
            return false;
        }

        return $user->vendor->status === 'active';
    }

    public function update(User $user, Product $product): bool
    {
        if ($this->adminLike($user)) {
            return true;
        }

        if (! $user->hasRole(['vendor_admin', 'vendor_staff'])) {
            return false;
        }

        $vendor = $user->vendor;

        return $vendor !== null && (int) $product->vendor_id === (int) $vendor->id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }
}
