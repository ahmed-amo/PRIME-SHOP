<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateProductSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if ($user === null) {
            return false;
        }

        $product = $this->route('product');
        if (! $product instanceof Product) {
            return false;
        }

        return $user->can('update', $product);
    }

    protected function prepareForValidation(): void
    {
        $compare = $this->input('compare_at_price');
        if ($compare === '' || $compare === null) {
            $this->merge(['compare_at_price' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $price = (float) $this->input('price');
            $compare = $this->input('compare_at_price');

            if ($compare === null || $compare === '') {
                return;
            }

            $compare = (float) $compare;
            if ($compare <= $price) {
                $validator->errors()->add(
                    'compare_at_price',
                    'Original price must be greater than the sale price.'
                );
            }
        });
    }
}
