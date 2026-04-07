<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $v = $this->input('hero_sort_order');
        if ($v === '' || $v === null) {
            $this->merge(['hero_sort_order' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'sale_enabled' => ['sometimes', 'boolean'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'sale_starts_at' => ['nullable', 'date'],
            'sale_ends_at' => ['nullable', 'date', 'after_or_equal:sale_starts_at'],
            'category_id' => ['required', 'exists:categories,id'],
            'stock' => ['required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255'],
            'status' => ['boolean'],
            'image' => ['nullable', 'image', 'max:20488'],
            'gallery_images' => ['nullable', 'array', 'max:5'],
            'gallery_images.*' => ['image', 'max:20488'],
            'replace_gallery' => ['sometimes', 'boolean'],
            'hero_sort_order' => ['nullable', 'integer', 'min:1', 'max:30'],
        ];
    }
}
