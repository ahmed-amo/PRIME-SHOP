<?php

namespace App\Support;

class Currency
{
    public static function da(float|int|string|null $amount): string
    {
        $value = (float) ($amount ?? 0);

        return (string) (int) round($value).' DA';
    }
}
