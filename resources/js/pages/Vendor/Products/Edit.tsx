import type { ReactNode } from 'react';
import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import VendorLayout from '@/layouts/vendor-layout';

interface Category {
    id: number;
    name: string;
}

interface ProductRow {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: number | null;
    status: boolean;
    image_url: string | null;
}

interface Props {
    product: ProductRow;
    categories: Category[];
}

export default function VendorProductEdit({ product, categories }: Props) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description ?? '');
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    const [categoryId, setCategoryId] = useState(product.category_id != null ? String(product.category_id) : '');
    const [listed, setListed] = useState(product.status);
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        const data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('price', price);
        data.append('stock', stock);
        data.append('category_id', categoryId);
        data.append('status', listed ? '1' : '0');
        if (image) data.append('image', image);
        data.append('_method', 'put');

        router.post(route('vendor.products.update', product.id), data, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Edit product" />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('vendor.products')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit product</h1>
                        <p className="text-sm text-muted-foreground">{product.name}</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.image_url ? (
                                <div className="flex items-center gap-4">
                                    <img src={product.image_url} alt="" className="h-24 w-24 rounded-lg border object-cover" />
                                    <p className="text-sm text-muted-foreground">Upload a file to replace the image.</p>
                                </div>
                            ) : null}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={categoryId} onValueChange={setCategoryId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">New image</Label>
                                <Input id="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                                <InputError message={errors.image} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="listed"
                                    type="checkbox"
                                    checked={listed}
                                    onChange={(e) => setListed(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="listed">Visible on storefront</Label>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={submitting || !categoryId}>
                                    Save changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

VendorProductEdit.layout = (page: ReactNode) => <VendorLayout>{page}</VendorLayout>;
