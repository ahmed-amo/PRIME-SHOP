import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'
import React from 'react'
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
  ];

export default function product() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
       <Head title="Categories" />
      <h2>Categories page</h2>
    </AppLayout>
  )
}
