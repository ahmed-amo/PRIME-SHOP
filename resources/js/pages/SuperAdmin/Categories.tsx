import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import SuperAdminLayout from '@/layouts/super-admin-layout';

interface CategoryRow {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    status: boolean;
    products_count: number;
    image_url: string | null;
    image: string | null;
}

interface Paginated {
    data: CategoryRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: { prev?: string | null; next?: string | null };
}

interface Props {
    categories: Paginated;
    success?: string | null;
}

export default function SuperAdminCategories({ categories, success }: Props) {
    const [msg, setMsg] = useState(success ?? '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editRow, setEditRow] = useState<CategoryRow | null>(null);
    const [deleteRow, setDeleteRow] = useState<CategoryRow | null>(null);

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(() => setMsg(''), 5000);
        return () => clearTimeout(t);
    }, [msg]);

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setColor('');
        setImage(null);
    };

    const openCreate = () => {
        resetForm();
        setCreateOpen(true);
    };

    const openEdit = (row: CategoryRow) => {
        setEditRow(row);
        setName(row.name);
        setSlug(row.slug);
        setDescription(row.description ?? '');
        setColor(row.color ?? '');
        setImage(null);
    };

    const submitCreate = () => {
        const fd = new FormData();
        fd.append('name', name);
        if (slug.trim()) fd.append('slug', slug.trim());
        fd.append('description', description);
        if (color.trim()) fd.append('color', color.trim());
        fd.append('status', '1');
        if (image) fd.append('image', image);
        router.post(route('super_admin.categories.store'), fd, {
            forceFormData: true,
            onSuccess: () => {
                setCreateOpen(false);
                resetForm();
                setMsg('Category created.');
            },
        });
    };

    const submitEdit = () => {
        if (!editRow) return;
        const fd = new FormData();
        fd.append('name', name);
        if (slug.trim()) fd.append('slug', slug.trim());
        fd.append('description', description);
        if (color.trim()) fd.append('color', color.trim());
        fd.append('status', '1');
        if (image) fd.append('image', image);
        fd.append('_method', 'put');
        router.post(route('super_admin.categories.update', editRow.id), fd, {
            forceFormData: true,
            onSuccess: () => {
                setEditRow(null);
                resetForm();
                setMsg('Category updated.');
            },
        });
    };

    const confirmDelete = () => {
        if (!deleteRow) return;
        router.delete(route('super_admin.categories.destroy', deleteRow.id), {
            onSuccess: () => {
                setDeleteRow(null);
                setMsg('Category deleted.');
            },
        });
    };

    return (
        <>
            <Head title="Categories" />
            <div className="space-y-6">
                {msg ? (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{msg}</AlertDescription>
                    </Alert>
                ) : null}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                        <p className="text-sm text-muted-foreground">Global catalog categories</p>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-700" onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add category
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All categories ({categories.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{c.slug}</TableCell>
                                            <TableCell>{c.products_count}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteRow(c)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {categories.last_page > 1 ? (
                            <div className="mt-4 flex justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {categories.current_page} of {categories.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {categories.links.prev ? (
                                        <Link href={categories.links.prev}>
                                            <Button variant="outline" size="sm">
                                                Previous
                                            </Button>
                                        </Link>
                                    ) : null}
                                    {categories.links.next ? (
                                        <Link href={categories.links.next}>
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

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Slug (optional)</Label>
                            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input value={color} onChange={(e) => setColor(e.target.value)} />
                        </div>
                        <div>
                            <Label>Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={submitCreate} disabled={!name.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Slug (optional)</Label>
                            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input value={color} onChange={(e) => setColor(e.target.value)} />
                        </div>
                        <div>
                            <Label>New image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditRow(null)}>
                            Cancel
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={submitEdit} disabled={!name.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. Categories with products cannot be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

SuperAdminCategories.layout = (page: ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
