<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * @return array<string, string>
     */
    private function localeMessages(string $locale): array
    {
        $path = lang_path($locale.'.json');

        if (! file_exists($path)) {
            return [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        return is_array($decoded) ? $decoded : [];
    }
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
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
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
            'messages' => $this->localeMessages($locale),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
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
