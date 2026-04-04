import type { ReactNode } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

import PhoneRequiredGate from '@/components/PhoneRequiredGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorPendingReview() {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    return (
        <>
            <Head title="Seller application pending" />
            <PhoneRequiredGate />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50/80 to-white p-6 dark:from-gray-950 dark:to-gray-900">
                <Card className="w-full max-w-md border-orange-100 shadow-lg dark:border-orange-950/50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Application received</CardTitle>
                        <CardDescription>
                            Your shop is waiting for approval from a platform administrator. You will be able to list products
                            once your account is active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {flash?.success ? (
                            <p className="rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-800 dark:bg-green-950/40 dark:text-green-200">
                                {flash.success}
                            </p>
                        ) : null}
                        <p className="text-center text-sm text-muted-foreground">
                            We will email you at your registered address when your shop is approved.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Browse marketplace</Link>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-muted-foreground"
                            type="button"
                            onClick={() => router.post(route('logout'))}
                        >
                            Log out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VendorPendingReview.layout = (page: ReactNode) => page;
