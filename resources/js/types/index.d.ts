import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core'
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    locale?: string;
    direction?: "ltr" | "rtl";
    messages?: Record<string, string>;
    quote: { message: string; author: string };
    auth: Auth;
    needs_phone?: boolean;
    adminNotifications?: {
        unreadCount: number;
        items: Array<{
            id: string;
            read_at: string | null;
            created_at: string | null;
            data: Record<string, unknown>;
        }>;
    } | null;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    vendorContext?: { shop_name: string; slug: string } | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    picture?: string | null;
    phone?: string | null;
    phone_country_dial?: string | null;
    address?: string | null;
    role?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface SharedProps {
  auth: {
    user: User
  }
  vendorContext?: { shop_name: string; slug: string } | null
}

export type PageProps<T = Record<string, unknown>> = InertiaPageProps & SharedProps & T
