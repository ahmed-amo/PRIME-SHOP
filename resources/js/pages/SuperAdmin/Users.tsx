import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SuperAdminLayout from '@/layouts/super-admin-layout';

interface Row {
    id: number;
    name: string;
    email: string;
    role: string | null;
    roles: string[];
}

interface Paginated {
    data: Row[];
    current_page: number;
    last_page: number;
    total: number;
    links: { prev?: string | null; next?: string | null };
}

interface Props {
    users: Paginated;
}

export default function SuperAdminUsers({ users }: Props) {
    return (
        <>
            <Head title="Users" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Users</h1>
                    <p className="text-sm text-muted-foreground">Registered accounts</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({users.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Legacy role</TableHead>
                                        <TableHead>Spatie roles</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>{u.role ?? '—'}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {u.roles.length ? u.roles.join(', ') : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {users.last_page > 1 ? (
                            <div className="mt-4 flex justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {users.current_page} of {users.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {users.links.prev ? (
                                        <Link href={users.links.prev}>
                                            <Button variant="outline" size="sm">
                                                Previous
                                            </Button>
                                        </Link>
                                    ) : null}
                                    {users.links.next ? (
                                        <Link href={users.links.next}>
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

SuperAdminUsers.layout = (page: ReactNode) => <SuperAdminLayout>{page}</SuperAdminLayout>;
