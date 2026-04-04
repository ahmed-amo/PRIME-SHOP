import type React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    LayoutGrid,
    LogOut,
    Menu,
    Package,
    Percent,
    Settings,
    ShoppingCart,
    Store,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { PageProps } from '@/types';
import { useI18n } from '@/lib/i18n';
import PhoneRequiredGate from '@/components/PhoneRequiredGate';

function postLogout() {
    router.post(route('logout'));
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const { url, props } = usePage<PageProps>();
    const { t, direction } = useI18n();
    const isRtl = direction === 'rtl';
    const vendorContext = props.vendorContext ?? null;
    const shopLabel = vendorContext?.shop_name ?? t('My shop');

    const navigation = [
        { name: t('Dashboard'), href: route('vendor.dashboard'), icon: BarChart3 },
        { name: t('My Products'), href: route('vendor.products'), icon: Package },
        { name: t('Sale pricing'), href: route('vendor.sales'), icon: Percent },
        { name: t('Orders'), href: route('vendor.orders'), icon: ShoppingCart },
        { name: t('Settings'), href: route('vendor.settings'), icon: Settings },
    ];

    const [mobileOpen, setMobileOpen] = useState(false);

    const NavLinks = (
        <nav className="flex flex-col gap-1 p-4 lg:p-4 lg:pt-6">
            {navigation.map((item) => {
                const path = typeof item.href === 'string' ? item.href : String(item.href);
                const isActive = url === path || url.startsWith(path + '/');
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/80'
                        } `}
                    >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div
            dir={direction}
            className="flex h-screen overflow-hidden bg-white dark:bg-gray-950"
        >
            <PhoneRequiredGate />
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-orange-400/15 to-orange-600/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-gradient-to-tl from-amber-400/10 to-orange-500/10 blur-3xl" />
            </div>

            <aside
                className={`relative z-10 hidden w-64 shrink-0 flex-col border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/90 lg:flex ${
                    isRtl ? 'border-l' : 'border-r'
                }`}
            >
                <div className="flex items-center gap-3 border-b border-gray-200/80 p-5 dark:border-gray-800/80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{shopLabel}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('Seller')}</p>
                    </div>
                </div>
                {NavLinks}
            </aside>

            <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                <header className="flex items-center justify-between gap-3 border-b border-gray-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/90 md:px-6">
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0" aria-label={t('Menu')}>
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={isRtl ? 'right' : 'left'} className="w-72 p-0">
                                <SheetHeader className="border-b border-gray-200 p-4 text-left dark:border-gray-800">
                                    <SheetTitle className="flex items-center gap-2 text-base">
                                        <LayoutGrid className="h-5 w-5 text-orange-600" />
                                        {shopLabel}
                                    </SheetTitle>
                                </SheetHeader>
                                {NavLinks}
                            </SheetContent>
                        </Sheet>
                    </div>

                    <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-gray-900 dark:text-white md:text-lg">
                        {shopLabel}
                    </h1>

                    <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-900 dark:text-orange-400 dark:hover:bg-orange-950/50"
                        onClick={postLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('Logout')}</span>
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
