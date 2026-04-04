<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VendorOrder;

class VendorOrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['vendor_admin', 'vendor_staff']) && $user->vendor !== null;
    }

    public function view(User $user, VendorOrder $vendorOrder): bool
    {
        if (! $user->hasRole(['vendor_admin', 'vendor_staff'])) {
            return false;
        }

        $vendor = $user->vendor;

        return $vendor !== null && (int) $vendorOrder->vendor_id === (int) $vendor->id;
    }

    public function update(User $user, VendorOrder $vendorOrder): bool
    {
        return $this->view($user, $vendorOrder);
    }
}
