<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return null;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $user = $request->user();
        $isAdmin = $user && $user->role === 'admin';

        $vendorContext = null;
        if ($user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['vendor_admin', 'vendor_staff'])) {
            $vendor = $user->vendor;
            if ($vendor) {
                $vendorContext = [
                    'shop_name' => $vendor->shop_name,
                    'slug' => $vendor->slug,
                    'status' => $vendor->status,
                ];
            }
        }

        return [
            ...parent::share($request),
            'flash' => [
                'review_submitted' => $request->session()->pull('review_submitted'),
            ],
            'name' => config('app.name'),
            'locale' => $locale,
            'direction' => $locale === 'ar' ? 'rtl' : 'ltr',
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => method_exists($user, 'uiRole') ? $user->uiRole() : $user->role,
                    'picture' => $user->picture,
                    'avatar' => $user->avatar,
                    'phone' => $user->phone,
                    'phone_country_dial' => $user->phone_country_dial,
                    'address' => $user->address,
                ] : null,
            ],
            'needs_phone' => $this->userNeedsPhone($user),
            'vendorContext' => $vendorContext,
            'adminNotifications' => $isAdmin ? [
                'unreadCount' => $user->unreadNotifications()->count(),
                'items' => $user->notifications()
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn ($notification): array => [
                        'id' => $notification->id,
                        'read_at' => $notification->read_at,
                        'created_at' => optional($notification->created_at)->toDateTimeString(),
                        'data' => $notification->data,
                    ]),
            ] : null,
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function userNeedsPhone(?\App\Models\User $user): bool
    {
        if ($user === null) {
            return false;
        }

        $phone = trim((string) ($user->phone ?? ''));
        $dial = trim((string) ($user->phone_country_dial ?? ''));

        return $phone === '' || $dial === '';
    }
}
