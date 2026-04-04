<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class VendorScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (! auth()->check()) {
            return;
        }

        $user = auth()->user();

        if (! method_exists($user, 'hasRole')) {
            return;
        }

        if (! $user->hasRole(['vendor_admin', 'vendor_staff'])) {
            return;
        }

        $vendor = $user->vendor;

        if ($vendor === null) {
            $builder->whereRaw('1 = 0');

            return;
        }

        $builder->where($model->getTable().'.vendor_id', $vendor->id);
    }
}
