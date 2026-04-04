import type { ReactNode } from 'react';
import { Head, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SuperAdminLayout from '@/layouts/super-admin-layout';

interface Row {
    id: number;
    shop_name: string;
    owner_email: string | null;
    product_count: number;
    order_count: number;
    status: string;
}

interface Paginated {
    data: Row[];
    current_page: number;
    last_page: number;
    total: number;
    links: { prev?: string | null; next?: string | null };
}

interface Props {
    vendors: Paginated;
}

function statusBadgeClass(status: string): string {
    if (status === 'active') {
        return 'border-green-200 text-green-800 dark:border-green-800 dark:text-green-200';
    }
    if (status === 'pending') {
        return 'border-amber-200 text-amber-900 dark:border-amber-800 dark:text-amber-100';
    }
    return 'border-red-200 text-red-800 dark:border-red-800 dark:text-red-200';
}

export default function SuperAdminVendors({ vendors }: Props) {
    const patchStatus = (id: number, status: 'pending' | 'active' | 'suspended') => {
        router.patch(
            route('super_admin.vendors.updateStatus', { vendor: id }),
            { status },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Vendors" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
                    <p className="text-sm text-muted-foreground">
                        Approve new sellers and manage shop access. Pending shops cannot list products until approved.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All vendors ({vendors.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Shop</TableHead>
                                        <TableHead>Owner email</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendors.data.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{v.shop_name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{v.owner_email ?? '—'}</TableCell>
                                            <TableCell>{v.product_count}</TableCell>
                                            <TableCell>{v.order_count}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusBadgeClass(v.status)}>
                                                    {v.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    {v.status === 'pending' ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => patchStatus(v.id, 'active')}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => patchStatus(v.id, 'suspended')}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : null}
                                                    {v.status === 'active' ? (
                                                        <Button size="sm" variant="outline" onClick={() => patchStatus(v.id, 'suspended')}>
                                                            Suspend
                                                        </Button>
                                                    ) : null}
                                                    {v.status === 'suspended' ? (
                                                        <Button
                                                            size="sm"
                                                            className="bg-orange-600 hover:bg-orange-700"
                                                            onClick={() => patchStatus(v.id, 'active')}
                                                        >
                                                            Reactivate
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SuperAdminVendors.layout = (page: ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
