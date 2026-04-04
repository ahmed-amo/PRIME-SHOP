<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Like Laravel's "email" rule, but allows underscores in the domain (e.g. admin@prime_shop.dz),
 * which strict DNS-oriented validators reject.
 */
class FlexibleEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $value === '') {
            $fail(__('validation.email'));

            return;
        }

        if (strlen($value) > 255) {
            $fail(__('validation.email'));

            return;
        }

        if (! preg_match('/^[^@\s]+@[^@\s]+\.[^@\s]+$/', $value)) {
            $fail(__('validation.email'));
        }
    }
}
