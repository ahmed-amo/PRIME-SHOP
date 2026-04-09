import type { ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import { FulfillmentStatusBadge } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VendorDashboardLayout from '@/pages/Dashboard/Layouts/vendor-dashboard-layout';
import { formatDA } from '@/lib/currency';

interface Row {
    id: number;
    order_number: string | null;
    customer_name: string | null;
    subtotal: number;
    status: string;
    created_at: string | null;
}

interface Paginated {
    data: Row[];
    current_page: number;
    last_page: number;
    total: number;
    links: { prev?: string | null; next?: string | null };
}

interface Props {
    orders: Paginated;
    filters: { status: string };
}

const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function VendorOrdersIndex({ orders, filters }: Props) {
    const setStatus = (v: string) => {
        router.get(
            route('vendor.orders'),
            { status: v },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Orders" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                        <p className="text-sm text-muted-foreground">Orders containing your products</p>
                    </div>
                    <div className="w-full sm:w-56">
                        <Select value={filters.status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Vendor orders ({orders.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((o) => (
                                        <TableRow key={o.id}>
                                            <TableCell className="font-medium">{o.order_number ?? '—'}</TableCell>
                                            <TableCell>{o.customer_name ?? '—'}</TableCell>
                                            <TableCell>{formatDA(o.subtotal)}</TableCell>
                                            <TableCell>
                                                <FulfillmentStatusBadge status={o.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('vendor.orders.show', o.id)} className="gap-1">
                                                        <Eye className="h-4 w-4" /> View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {orders.data.length === 0 ? <p className="py-8 text-center text-muted-foreground">No orders.</p> : null}
                    </CardContent>
                </Card>

                {orders.last_page > 1 ? (
                    <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {orders.current_page} of {orders.last_page}
                        </p>
                        <div className="flex gap-2">
                            {orders.links.prev ? (
                                <Link href={orders.links.prev}>
                                    <Button variant="outline" size="sm">
                                        Previous
                                    </Button>
                                </Link>
                            ) : null}
                            {orders.links.next ? (
                                <Link href={orders.links.next}>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

VendorOrdersIndex.layout = (page: ReactNode) => <VendorDashboardLayout>{page}</VendorDashboardLayout>;
