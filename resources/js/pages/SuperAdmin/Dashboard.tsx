import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Package, ShoppingCart, Store, Wallet } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import { formatDA } from '@/lib/currency';

interface Props {
    stats: {
        totalVendors: number;
        totalCustomers: number;
        totalOrders: number;
        totalRevenue: number;
    };
}

export default function SuperAdminDashboard({ stats }: Props) {
    return (
        <>
            <Head title="Super Admin" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Platform overview</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total vendors</CardTitle>
                            <Store className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.totalVendors}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total customers</CardTitle>
                            <Package className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.totalCustomers}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{stats.totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200/80 shadow-sm dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total revenue</CardTitle>
                            <Wallet className="h-4 w-4 text-orange-600" />
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

SuperAdminDashboard.layout = (page: ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
