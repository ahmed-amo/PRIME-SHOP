"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Percent, Save, XCircle, RefreshCw } from "lucide-react"
import AdminLayout from "../Layouts/admin-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n"

interface ProductRow {
  id: number
  name: string
  slug: string
  sku: string | null
  price: number
  compare_at_price: number | null
  discount_percentage: number
  is_on_sale: boolean
  has_compare_at_sale?: boolean
  stock: number
  category: string | null
  image_url: string | null
}

interface Paginated {
  data: ProductRow[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: { prev?: string | null; next?: string | null }
}

interface Props {
  products: Paginated
}

export default function Sales({ products }: Props) {
  const { t } = useI18n()
  const { flash, errors } = usePage<{ flash?: { success?: string }; errors?: Record<string, string> }>().props
  const [flashMessage, setFlashMessage] = useState(flash?.success || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [savingId, setSavingId] = useState<number | null>(null)

  /**
   * originalInput → DB `compare_at_price` (struck-through “was” price).
   * saleInput → DB `price` (what customers pay).
   * Not on sale: first column = current list price (`price`), sale column left empty to type the promo price.
   * On sale: first = compare-at, second = current sale price.
   */
  const [rows, setRows] = useState<Record<number, { originalInput: string; saleInput: string }>>({})

  useEffect(() => {
    const next: Record<number, { originalInput: string; saleInput: string }> = {}
    products.data.forEach((p) => {
      const onCompareSale =
        p.compare_at_price != null && p.compare_at_price > p.price
      next[p.id] = {
        originalInput: onCompareSale ? String(p.compare_at_price) : String(p.price),
        saleInput: onCompareSale ? String(p.price) : "",
      }
    })
    setRows(next)
  }, [products.data])

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [flashMessage])

  const filtered = useMemo(
    () =>
      products.data.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [products.data, searchQuery],
  )

  const updateRow = (id: number, field: "originalInput" | "saleInput", value: string) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const saveRow = (product: ProductRow) => {
    const row = rows[product.id]
    if (!row) return

    setSavingId(product.id)
    router.patch(
      route("admin.sales.update", product.id),
      {
        price: parseFloat(row.saleInput) || 0,
        compare_at_price: row.originalInput.trim() === "" ? null : parseFloat(row.originalInput),
      },
      {
        preserveScroll: true,
        onSuccess: () => setFlashMessage(t("Sale pricing updated.")),
        onFinish: () => setSavingId(null),
      },
    )
  }

  const clearSale = (product: ProductRow) => {
    const row = rows[product.id]
    if (!row) return

    const list = parseFloat(row.originalInput)
    const sale = parseFloat(row.saleInput)
    const restorePrice =
      !Number.isNaN(list) && list > 0
        ? list
        : !Number.isNaN(sale) && sale > 0
          ? sale
          : product.price

    setSavingId(product.id)
    router.patch(
      route("admin.sales.update", product.id),
      {
        price: restorePrice,
        compare_at_price: null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setFlashMessage(t("Sale removed for this product."))
        },
        onFinish: () => setSavingId(null),
      },
    )
  }

  return (
    <div className="space-y-6">
      {flashMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{flashMessage}</AlertDescription>
        </Alert>
      )}
      {errors?.compare_at_price && (
        <Alert variant="destructive">
          <AlertDescription>{errors.compare_at_price}</AlertDescription>
        </Alert>
      )}
      {errors?.price && (
        <Alert variant="destructive">
          <AlertDescription>{errors.price}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Percent className="h-8 w-8 text-orange-500" />
            {t("Sale pricing")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {t("First column is the list/original price. Enter the new sale price in the second column (empty until you add a promotion). Original must be higher than sale price.")}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => router.reload({ only: ["products"] })} title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t("Products")} ({filtered.length} / {products.total})</CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search products, orders, customers...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{t("No products found.")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Product")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Original price")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Sale price")}</TableHead>
                    <TableHead>{t("Discount")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const onCompareSale =
                      p.compare_at_price != null && p.compare_at_price > p.price
                    const row = rows[p.id] ?? {
                      originalInput: onCompareSale ? String(p.compare_at_price) : String(p.price),
                      saleInput: onCompareSale ? String(p.price) : "",
                    }
                    const orig = parseFloat(row.originalInput)
                    const sale = parseFloat(row.saleInput)
                    const pct =
                      row.saleInput.trim() !== "" &&
                      row.originalInput.trim() !== "" &&
                      !Number.isNaN(orig) &&
                      !Number.isNaN(sale) &&
                      orig > sale
                        ? Math.round(((orig - sale) / orig) * 100)
                        : 0

                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt=""
                                className="w-10 h-10 rounded-md object-cover border"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-muted" />
                            )}
                            <div>
                              <div className="font-medium line-clamp-1">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.category || "—"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            className="w-[120px]"
                            value={row.originalInput}
                            onChange={(e) => updateRow(p.id, "originalInput", e.target.value)}
                            placeholder={t("Original")}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            className="w-[120px]"
                            value={row.saleInput}
                            onChange={(e) => updateRow(p.id, "saleInput", e.target.value)}
                            placeholder={t("New sale price")}
                          />
                        </TableCell>
                        <TableCell>
                          {pct > 0 ? (
                            <Badge className="bg-red-500 hover:bg-red-600">{pct}%</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <Button
                              size="sm"
                              className="gap-1 bg-orange-500 hover:bg-orange-600"
                              onClick={() => saveRow(p)}
                              disabled={savingId === p.id}
                            >
                              {savingId === p.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              {t("Save")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => clearSale(p)}
                              disabled={savingId === p.id || !(p.has_compare_at_sale ?? p.is_on_sale)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {t("Clear sale")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {products.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {products.current_page} of {products.last_page}
          </p>
          <div className="flex gap-2">
            {products.links.prev && (
              <Link href={products.links.prev}>
                <Button variant="outline" size="sm">
                  Previous
                </Button>
              </Link>
            )}
            {products.links.next && (
              <Link href={products.links.next}>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

Sales.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>
