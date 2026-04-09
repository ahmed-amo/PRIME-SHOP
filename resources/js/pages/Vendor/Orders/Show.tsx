import type { ReactNode } from 'react';
import { FormEvent, useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { FulfillmentStatusBadge } from '@/components/order-status-badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VendorDashboardLayout from '@/pages/Dashboard/Layouts/vendor-dashboard-layout';
import { formatDA } from '@/lib/currency';

interface Item {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
}

interface Props {
    vendorOrder: { id: number; status: string; subtotal: number; created_at: string | null };
    order: { order_number: string; customer_name: string | null; created_at: string | null } | null;
    items: Item[];
}

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function VendorOrderShow({ vendorOrder, order, items }: Props) {
    const [status, setStatus] = useState(vendorOrder.status);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        setStatus(vendorOrder.status);
    }, [vendorOrder.status]);

    const saveStatus = (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        router.patch(
            route('vendor.orders.update', vendorOrder.id),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => setMsg('Status updated.'),
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <>
            <Head title={`Order ${order?.order_number ?? vendorOrder.id}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('vendor.orders')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Order detail</h1>
                        <p className="text-sm text-muted-foreground">{order?.order_number ?? `Vendor order #${vendorOrder.id}`}</p>
                    </div>
                </div>

                {msg ? (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{msg}</AlertDescription>
                    </Alert>
                ) : null}

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {order ? (
                            <>
                                <p>
                                    <span className="text-muted-foreground">Order number:</span>{' '}
                                    <span className="font-medium">{order.order_number}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Customer:</span>{' '}
                                    <span className="font-medium">{order.customer_name ?? '—'}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Placed:</span>{' '}
                                    {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                                </p>
                            </>
                        ) : null}
                        <p>
                            <span className="text-muted-foreground">Your subtotal:</span>{' '}
                            <span className="font-semibold">{formatDA(vendorOrder.subtotal)}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="text-muted-foreground">Current status:</span>
                            <FulfillmentStatusBadge status={vendorOrder.status} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Line total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell className="font-medium">{it.product_name}</TableCell>
                                        <TableCell>{it.quantity}</TableCell>
                                        <TableCell>{formatDA(it.unit_price)}</TableCell>
                                        <TableCell className="text-right">{formatDA(it.line_total)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Update status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={saveStatus} className="flex flex-col gap-4 sm:max-w-xs">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-fit bg-orange-600 hover:bg-orange-700" disabled={saving}>
                                Save status
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VendorOrderShow.layout = (page: ReactNode) => <VendorDashboardLayout>{page}</VendorDashboardLayout>;
