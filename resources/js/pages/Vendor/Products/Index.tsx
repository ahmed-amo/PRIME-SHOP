import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VendorDashboardLayout from '@/pages/Dashboard/Layouts/vendor-dashboard-layout';
import { formatDA } from '@/lib/currency';

interface Row {
    id: number;
    name: string;
    category: string | null;
    price: number;
    stock: number;
    status: string;
    listed: boolean;
    image_url: string | null;
}

interface Paginated {
    data: Row[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { prev?: string | null; next?: string | null };
}

interface Props {
    products: Paginated;
    success?: string | null;
}

export default function VendorProductsIndex({ products, success }: Props) {
    const [flashMessage, setFlashMessage] = useState(success ?? '');
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (!flashMessage) return;
        const t = setTimeout(() => setFlashMessage(''), 4000);
        return () => clearTimeout(t);
    }, [flashMessage]);

    const filtered = products.data.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    const deleteProduct = (id: number) => {
        if (!confirm('Delete this product?')) return;
        setDeletingId(id);
        router.delete(route('vendor.products.destroy', id), {
            onFinish: () => setDeletingId(null),
            onSuccess: () => setFlashMessage('Product deleted.'),
        });
    };

    return (
        <>
            <Head title="My products" />
            <div className="space-y-6">
                {flashMessage ? (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{flashMessage}</AlertDescription>
                    </Alert>
                ) : null}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Products</h1>
                        <p className="text-sm text-muted-foreground">Manage your catalog</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" type="button" onClick={() => router.reload({ only: ['products'] })}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                            <Link href={route('vendor.products.create')} className="gap-2">
                                <Plus className="h-4 w-4" /> Add product
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Your products ({filtered.length} of {products.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filtered.length === 0 ? (
                            <p className="py-12 text-center text-muted-foreground">No products yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-14">Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell>
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
                                                            alt=""
                                                            className="h-12 w-12 rounded-lg border object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                                                            —
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{p.name}</TableCell>
                                                <TableCell>{p.category ?? '—'}</TableCell>
                                                <TableCell>{formatDA(p.price)}</TableCell>
                                                <TableCell>{p.stock}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={p.listed ? 'border-green-200 text-green-800' : 'border-gray-300 text-gray-600'}>
                                                        {p.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('vendor.products.edit', p.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteProduct(p.id)}
                                                            disabled={deletingId === p.id}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {products.last_page > 1 ? (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {products.current_page} of {products.last_page} ({products.total} total)
                        </p>
                        <div className="flex gap-2">
                            {products.links.prev ? (
                                <Link href={products.links.prev}>
                                    <Button variant="outline" size="sm">
                                        Previous
                                    </Button>
                                </Link>
                            ) : null}
                            {products.links.next ? (
                                <Link href={products.links.next}>
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

VendorProductsIndex.layout = (page: ReactNode) => <VendorDashboardLayout>{page}</VendorDashboardLayout>;
