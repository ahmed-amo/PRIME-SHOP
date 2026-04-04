"use client";

import { useMemo, useState, memo } from "react";
import StatsCard from "@/components/extra/adminStats";
import { DollarSign, Users, ShoppingCart, Package, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/pages/Dashboard/Layouts/admin-layout";
import { formatDA } from "@/lib/currency";
import { useCountUp } from "@/hooks/useCountUp";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface TopCustomer {
  name: string;
  totalSpent: number;
  totalOrders: number;
}

interface MonthlyReg {
  month: string;
  count: number;
}

interface ChartPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface RecentOrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface TopProductRow {
  id: number;
  name: string;
  units: number;
  revenue: number;
  thumbnail: string | null;
}

interface LowStockRow {
  id: number;
  name: string;
  stock: number;
  sku: string | null;
}

interface SalesDashboard {
  kpis: {
    revenue7d: number;
    revenueTrendPercent: number;
    ordersToday: number;
    orders7d: number;
    ordersTrendPercent: number;
    activeProducts: number;
    productsTrendPercent: number;
    conversionRate: number;
  };
  chartDaily: ChartPoint[];
  recentOrders: RecentOrderRow[];
  topProducts: TopProductRow[];
  lowStock: LowStockRow[];
}

interface Stats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  activeCustomers?: number;
  inactiveCustomers?: number;
  topCustomers?: TopCustomer[];
  monthlyRegistrations?: MonthlyReg[];
  salesDashboard?: SalesDashboard;
}

interface StatsPageProps {
  stats: Stats;
}

/** Simple bar chart (no recharts) — works when node_modules is empty/out of sync (e.g. Docker volume). */
function SalesOverviewBarChart({
  data,
  chartMode,
}: {
  data: { label: string; revenue: number; orders: number }[];
  chartMode: "daily" | "weekly" | "monthly";
}) {
  const maxR = Math.max(...data.map((d) => d.revenue), 1e-9);
  const labelStride =
    chartMode === "daily" && data.length > 16 ? Math.ceil(data.length / 12) : 1;

  return (
    <div className="flex h-80 flex-col">
      <div className="flex min-h-0 flex-1 items-end gap-px border-b border-border pb-1 sm:gap-1">
        {data.map((d, i) => (
          <div key={`${d.label}-${i}`} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div
              className="w-full min-h-[2px] rounded-t bg-orange-500/90 transition-colors hover:bg-orange-600 dark:bg-orange-600/90"
              style={{ height: `${Math.max(0.5, (d.revenue / maxR) * 100)}%` }}
              title={`${d.label} — ${formatDA(d.revenue)} · ${d.orders} orders`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex max-h-10 gap-px overflow-x-auto sm:gap-1">
        {data.map((d, i) => (
          <div
            key={`lbl-${i}`}
            className="min-w-0 flex-1 truncate text-center text-[10px] leading-tight text-muted-foreground sm:text-xs"
          >
            {i % labelStride === 0 ? d.label : ""}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Bar height = revenue · hover a bar for orders count
      </p>
    </div>
  );
}

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "completed":
      return "default";
    case "shipped":
    case "processing":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

const AnimatedRevenue = memo(function AnimatedRevenue({ value }: { value: number }) {
  const v = useCountUp(value, 1000);
  return <>{formatDA(v)}</>;
});

const AnimatedInt = memo(function AnimatedInt({ value }: { value: number }) {
  const v = useCountUp(value, 800);
  return <>{Math.round(v).toLocaleString()}</>;
});

const AnimatedPercent = memo(function AnimatedPercent({ value }: { value: number }) {
  const v = useCountUp(value, 900);
  return <>{v.toFixed(1)}%</>;
});

function aggregateChart(data: ChartPoint[], mode: "daily" | "weekly" | "monthly") {
  if (mode === "daily") {
    return data.map((d) => ({
      label: d.label,
      revenue: d.revenue,
      orders: d.orders,
    }));
  }

  const buckets = new Map<string, { revenue: number; orders: number; label: string }>();

  for (const row of data) {
    const date = new Date(row.date + "T12:00:00");
    let key: string;
    let label: string;

    if (mode === "weekly") {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      key = start.toISOString().slice(0, 10);
      label = `Wk ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    } else {
      key = row.date.slice(0, 7);
      label = row.date.slice(0, 7);
    }

    const cur = buckets.get(key) ?? { revenue: 0, orders: 0, label };
    cur.revenue += row.revenue;
    cur.orders += row.orders;
    cur.label = label;
    buckets.set(key, cur);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ label: v.label, revenue: v.revenue, orders: v.orders }));
}

export default function DashboardPage({ stats }: StatsPageProps) {
  const sd = stats.salesDashboard;
  const [chartMode, setChartMode] = useState<"daily" | "weekly" | "monthly">("daily");

  const chartData = useMemo(() => {
    if (!sd?.chartDaily?.length) return [];
    return aggregateChart(sd.chartDaily, chartMode);
  }, [sd?.chartDaily, chartMode]);

  const revTrend = sd?.kpis.revenueTrendPercent ?? 0;
  const ordTrend = sd?.kpis.ordersTrendPercent ?? 0;
  const prodTrend = sd?.kpis.productsTrendPercent ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Sales dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue, orders, catalog health, and recent activity.
        </p>
      </div>

      <ErrorBoundary>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Revenue (7 days)"
            value={sd ? <AnimatedRevenue value={sd.kpis.revenue7d} /> : formatDA(stats.totalRevenue)}
            icon={DollarSign}
            iconColor="success"
            trend={{
              value: sd ? `${revTrend >= 0 ? "+" : ""}${revTrend}% vs prior 7d` : "All time",
              isPositive: sd ? revTrend >= 0 : true,
            }}
          />
          <StatsCard
            title="Orders today"
            value={sd ? <AnimatedInt value={sd.kpis.ordersToday} /> : stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            iconColor="warning"
            trend={{
              value: sd ? `${sd.kpis.orders7d} orders (7d)` : `${stats.totalOrders} total`,
              isPositive: ordTrend >= 0,
            }}
          />
          <StatsCard
            title="Active products"
            value={sd ? <AnimatedInt value={sd.kpis.activeProducts} /> : "—"}
            icon={Package}
            iconColor="primary"
            trend={{
              value: sd ? `${prodTrend >= 0 ? "+" : ""}${prodTrend}% vs snapshot` : "Listed",
              isPositive: prodTrend >= 0,
            }}
          />
          <StatsCard
            title="Conversion"
            value={sd ? <AnimatedPercent value={sd.kpis.conversionRate} /> : "—"}
            icon={TrendingUp}
            iconColor="accent"
            trend={{
              value: "Orders / registered users",
              isPositive: (sd?.kpis.conversionRate ?? 0) > 1,
            }}
          />
        </div>
      </ErrorBoundary>

      {sd && chartData.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue & orders
              </CardTitle>
              <p className="text-sm text-muted-foreground">Last 30 days — switch grouping below</p>
            </div>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((m) => (
                <Button
                  key={m}
                  type="button"
                  size="sm"
                  variant={chartMode === m ? "default" : "outline"}
                  onClick={() => setChartMode(m)}
                  className="capitalize"
                >
                  {m}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <SalesOverviewBarChart data={chartData} chartMode={chartMode} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {stats.topCustomers && stats.topCustomers.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Top customers</CardTitle>
              <p className="text-sm text-muted-foreground">By lifetime spend</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Customer</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topCustomers.map((customer, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-semibold">{formatDA(customer.totalSpent)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {sd && sd.recentOrders.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Recent orders</CardTitle>
              <p className="text-sm text-muted-foreground">Latest 10</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sd.recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                      <TableCell className="max-w-[140px] truncate">{o.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(o.status)} className="capitalize">
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatDA(o.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {sd && sd.topProducts.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Top selling products</CardTitle>
            <p className="text-sm text-muted-foreground">By units sold (all time)</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sd.topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 rounded-xl border border-border p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.units} sold · {formatDA(p.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sd && sd.lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100">Low stock alerts</CardTitle>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/80">Under 20 units</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {sd.lowStock.map((p) => (
                <li key={p.id} className="flex justify-between gap-4 rounded-lg border border-amber-200/60 bg-white/60 px-3 py-2 dark:border-amber-800 dark:bg-black/20">
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="shrink-0 text-amber-800 dark:text-amber-200">
                    {p.stock} left {p.sku ? `· ${p.sku}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {stats.monthlyRegistrations && stats.monthlyRegistrations.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer registrations (6 mo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-lg">
              {stats.monthlyRegistrations.map((reg, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{reg.month}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${(reg.count / Math.max(...stats.monthlyRegistrations!.map((r) => r.count), 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-medium">{reg.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

DashboardPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
