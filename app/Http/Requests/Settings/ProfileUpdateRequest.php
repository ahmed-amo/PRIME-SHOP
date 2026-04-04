<?php

namespace App\Http\Requests\Settings;

use App\Rules\FlexibleEmail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() !== null;
    }

    public function rules()
    {
        $userId = $this->user()->id;
        return [
            'name' => ['required','string','max:255'],
            'email' => ['required', new FlexibleEmail, 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => ['nullable','string','max:30'],
            'address' => ['nullable','string','max:500'],
            'password' => ['nullable','string','min:8','confirmed'],
        ];
    }


}
