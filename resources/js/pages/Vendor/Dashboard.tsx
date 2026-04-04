import type { ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Package, ShoppingCart, Clock, Banknote } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VendorLayout from '@/layouts/vendor-layout';
import type { PageProps } from '@/types';
import { formatDA } from '@/lib/currency';

export interface VendorDashboardStats {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}

interface VendorDashboardPageProps extends PageProps {
    stats: VendorDashboardStats;
    flash?: { success?: string | null };
}

export default function VendorDashboardPage() {
    const { stats, flash } = usePage<VendorDashboardPageProps>().props;

    return (
        <>
            <Head title="Vendor dashboard" />

            {flash?.success ? (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
                    {flash.success}
                </div>
            ) : null}

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Overview of your shop performance.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total products
                            </CardTitle>
                            <Package className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.totalProducts}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total orders
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.totalOrders}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending orders
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.pendingOrders}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total revenue
                            </CardTitle>
                            <Banknote className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{formatDA(stats.totalRevenue)}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

VendorDashboardPage.layout = (page: ReactNode) => <VendorLayout>{page}</VendorLayout>;
