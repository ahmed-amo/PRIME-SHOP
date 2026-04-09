import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ShoppingBag, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';
    const isVendor = user?.role === 'vendor_admin' || user?.role === 'vendor_staff';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Choose where to go next.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Store className="h-5 w-5" />
                                Storefront
                            </CardTitle>
                            <CardDescription>Browse products and categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/">Go to shop</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {isAdmin ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <LayoutDashboard className="h-5 w-5" />
                                    Admin
                                </CardTitle>
                                <CardDescription>Orders, products, and analytics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={route('admin.dashboard')}>Open admin dashboard</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ShoppingBag className="h-5 w-5" />
                                    My account
                                </CardTitle>
                                <CardDescription>Orders and profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={isVendor ? "/vendor/dashboard" : "/client/dashboard"}>
                                        {isVendor ? "Vendor dashboard" : "Client dashboard"}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Settings</CardTitle>
                        <CardDescription>Profile, password, and appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/settings/profile">Profile</Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/settings/password">Password</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
