import type { ReactNode } from "react"
import { ShoppingBag, Heart, Package, CheckCircle } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import StatsCard from "@/components/extra/adminStats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ClientLayout from "../Layouts/client-layout"
import { useWishlist } from "@/contexts/wishlistContext"
import { formatDA } from "@/lib/currency"
import { useI18n } from "@/lib/i18n"

type DashboardStats = {
  total_orders: number
  active_orders: number
  completed_orders: number
}

type RecentOrderRow = {
  id: string
  date: string
  status: string
  status_key: string
  total: string
  items_count: number
}

function statusBadgeClass(statusKey: string): string {
  const s = statusKey.toLowerCase()
  if (s === "delivered") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
  if (s === "shipped" || s === "confirmed") return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
  if (s === "cancelled") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
  return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
}

export default function ClientDashboard() {
  const { t, direction } = useI18n()
  const isRtl = direction === "rtl"
  const page = usePage<{
    auth: { user: { name: string } | null }
    stats: DashboardStats
    recentOrders: RecentOrderRow[]
  }>()
  const { auth, stats, recentOrders } = page.props
  const { wishlistItems } = useWishlist()
  const firstName = auth.user?.name?.split(/\s+/)[0] ?? ""

  const wishlistPreview = wishlistItems.slice(0, 4)

  return (
    <div dir={direction} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {firstName ? `${t("Welcome back")}, ${firstName}!` : t("Welcome back")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("Here's what's happening with your account")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title={t("Total Orders")} value={String(stats.total_orders)} icon={ShoppingBag} iconColor="primary" />
        <StatsCard
          title={t("Wishlist Items")}
          value={String(wishlistItems.length)}
          icon={Heart}
          iconColor="accent"
        />
        <StatsCard title={t("Active Orders")} value={String(stats.active_orders)} icon={Package} iconColor="success" />
        <StatsCard
          title={t("Completed Orders")}
          value={String(stats.completed_orders)}
          icon={CheckCircle}
          iconColor="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>{t("Recent Orders")}</CardTitle>
              <CardDescription>{t("Your latest purchases")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/my-orders">{t("View All")}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">{t("No recent orders yet")}</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-2 p-4 border rounded-lg">
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium truncate">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.date}
                        {order.items_count > 0
                          ? ` · ${order.items_count} ${order.items_count === 1 ? t("item") : t("items")}`
                          : ""}
                      </p>
                    </div>
                    <div className={`${isRtl ? "text-left" : "text-right"} space-y-1 shrink-0`}>
                      <p className="font-semibold text-primary">{order.total}</p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                          order.status_key,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>{t("Wishlist")}</CardTitle>
              <CardDescription>{t("Products you have saved")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/wishlist">{t("View All")}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {wishlistPreview.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm text-muted-foreground">{t("Your wishlist is empty")}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/shop">{t("Continue Shopping")}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistPreview.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Link
                      href={product.slug ? `/product/${product.slug}` : "/shop"}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-primary font-semibold mt-1">{formatDA(product.price)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

ClientDashboard.layout = (page: ReactNode) => <ClientLayout>{page}</ClientLayout>
