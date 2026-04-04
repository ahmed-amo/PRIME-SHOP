import type { ReactNode } from 'react';
import { Head, Link, router } from '@inertiajs/react';

import PhoneRequiredGate from '@/components/PhoneRequiredGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorAccountSuspended() {
    return (
        <>
            <Head title="Account suspended" />
            <PhoneRequiredGate />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50/50 to-white p-6 dark:from-gray-950 dark:to-gray-900">
                <Card className="w-full max-w-md border-red-100 shadow-lg dark:border-red-950/40">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Shop suspended</CardTitle>
                        <CardDescription>
                            Your seller account is not active. If you think this is a mistake, contact platform support.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Back to marketplace</Link>
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

VendorAccountSuspended.layout = (page: ReactNode) => page;
