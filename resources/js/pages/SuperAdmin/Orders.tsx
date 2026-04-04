import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';

import { FulfillmentStatusBadge } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import { formatDA } from '@/lib/currency';

interface Row {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total: number;
    status: string;
    created_at: string | null;
    vendor_count: number;
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
}

export default function SuperAdminOrders({ orders }: Props) {
    return (
        <>
            <Head title="Orders" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                    <p className="text-sm text-muted-foreground">Platform-wide orders</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All orders ({orders.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Vendors</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((o) => (
                                        <TableRow key={o.id}>
                                            <TableCell className="font-medium">{o.order_number}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{o.customer_name}</div>
                                                <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                                            </TableCell>
                                            <TableCell>{formatDA(o.total)}</TableCell>
                                            <TableCell>{o.vendor_count}</TableCell>
                                            <TableCell>
                                                <FulfillmentStatusBadge status={o.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {orders.last_page > 1 ? (
                            <div className="mt-4 flex justify-between">
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SuperAdminOrders.layout = (page: ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
