import ProductTable from '@/components/dashboard/ProductTable';
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'
import React from 'react'
const breadcrumbs: BreadcrumbItem[] = [
  {
      title: 'Products',
      href: '/products',
  },
];
export default function product() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
       <Head title="Products" />
       <ProductTable></ProductTable>
    </AppLayout>
  )
}
