<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RequiredPhoneController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone_country_dial' => ['required', 'string', Rule::in(['213', '33', '216'])],
            'phone' => ['required', 'string', 'regex:/^[\d\s]{6,20}$/'],
        ]);

        $national = preg_replace('/\D/', '', $validated['phone']);
        if (strlen($national) < 6) {
            return back()->withErrors(['phone' => __('phone_too_short')]);
        }

        $user = $request->user();
        $user->phone_country_dial = $validated['phone_country_dial'];
        $user->phone = $national;
        $user->save();

        if ($user->vendor) {
            $user->vendor->update([
                'phone_country_dial' => $validated['phone_country_dial'],
                'phone' => $national,
            ]);
        }

        return back();
    }
}
