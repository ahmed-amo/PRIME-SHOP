<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'max:20488'],
            'gallery_images' => ['nullable', 'array', 'max:5'],
            'gallery_images.*' => ['image', 'max:20488'],
        ];
    }
}
