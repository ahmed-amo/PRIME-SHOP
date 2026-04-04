<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Disable CSRF verification while running tests.
     */
    protected function inExceptArray($request): bool
    {
        if (app()->environment('testing')) {
            return true;
        }

        return parent::inExceptArray($request);
    }

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'categories',
        'categories/*',
        'admin/categories',
        'admin/categories/*',

    ];
}
