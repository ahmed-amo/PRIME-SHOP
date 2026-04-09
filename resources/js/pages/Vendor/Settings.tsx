import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';

import VendorDashboardLayout from '@/pages/Dashboard/Layouts/vendor-dashboard-layout';

export default function VendorSettingsPage() {
    return (
        <>
            <Head title="Shop settings" />
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-2 text-sm text-muted-foreground">Shop settings will be available here soon.</p>
        </>
    );
}

VendorSettingsPage.layout = (page: ReactNode) => <VendorDashboardLayout>{page}</VendorDashboardLayout>;
