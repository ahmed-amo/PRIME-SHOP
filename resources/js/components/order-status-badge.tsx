import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** Unified fulfillment status styling: vendor sub-orders and platform orders (same palette). */
export const fulfillmentStatusBadgeClassName: Record<string, string> = {
    pending: 'border bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800',
    processing: 'border bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    confirmed: 'border bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    shipped: 'border bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800',
    delivered: 'border bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
    cancelled: 'border bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
};

export function formatFulfillmentStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function FulfillmentStatusBadge({ status, className }: { status: string; className?: string }) {
    const key = status.toLowerCase();
    const styles = fulfillmentStatusBadgeClassName[key] ?? fulfillmentStatusBadgeClassName.pending;

    return (
        <Badge variant="outline" className={cn(styles, className)}>
            {formatFulfillmentStatusLabel(key)}
        </Badge>
    );
}
