import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
import {
  Package2,
  Users,
  BarChart3,
  DollarSign,
  ArrowRight,
  Search,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Dummy data
const analyticsData = {
  totalProducts: 254,
  totalUsers: 1823,
  totalCategories: 32,
  totalInventoryValue: 543920,
};

const recentProducts = [
  {
    id: 1,
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 199.99,
    stock: 24,
    status: "In Stock",
    image: "/api/placeholder/60/60",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    category: "Electronics",
    price: 1999.99,
    stock: 12,
    status: "Low Stock",
    image: "/api/placeholder/60/60",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    category: "Audio",
    price: 129.99,
    stock: 45,
    status: "In Stock",
    image: "/api/placeholder/60/60",
  },
  {
    id: 4,
    name: "Office Desk",
    category: "Furniture",
    price: 349.99,
    stock: 8,
    status: "Low Stock",
    image: "/api/placeholder/60/60",
  },
  {
    id: 5,
    name: "Smart Watch Series 8",
    category: "Wearables",
    price: 399.99,
    stock: 0,
    status: "Out of Stock",
    image: "/api/placeholder/60/60",
  },
];

const recentSales = [
  {
    id: 1,
    customer: "John Doe",
    email: "john@example.com",
    product: "Ergonomic Chair",
    date: "2025-04-24",
    amount: 199.99,
    status: "Completed",
  },
  {
    id: 2,
    customer: "Jane Smith",
    email: "jane@example.com",
    product: "MacBook Pro M3",
    date: "2025-04-23",
    amount: 1999.99,
    status: "Processing",
  },
  {
    id: 3,
    customer: "Robert Johnson",
    email: "robert@example.com",
    product: "Wireless Earbuds",
    date: "2025-04-22",
    amount: 129.99,
    status: "Completed",
  },
  {
    id: 4,
    customer: "Emily Davis",
    email: "emily@example.com",
    product: "Office Desk",
    date: "2025-04-21",
    amount: 349.99,
    status: "Completed",
  },
  {
    id: 5,
    customer: "Michael Wilson",
    email: "michael@example.com",
    product: "Smart Watch Series 8",
    date: "2025-04-20",
    amount: 399.99,
    status: "Cancelled",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const Dashboard = () => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
    <div className="p-6 bg-white-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Products
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package2 size={18} className="text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalProducts}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 flex items-center"
            >
              View details <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>

        {/* Total Users Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Users
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users size={18} className="text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="link"
              className="p-0 h-auto text-green-600 flex items-center"
            >
              View details <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>

        {/* Total Categories Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Categories
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 size={18} className="text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalCategories}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 flex items-center"
            >
              View details <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>

        {/* Total Inventory Value Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Inventory Value
              </CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign size={18} className="text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData.totalInventoryValue)}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="link"
              className="p-0 h-auto text-amber-600 flex items-center"
            >
              View details <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Products Table */}
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8 w-64"
                  />
                </div>
                <Button>Add Product</Button>
              </div>
            </div>
            <CardDescription>A list of your recent products</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing 5 of {analyticsData.totalProducts} products
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <div>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Sales</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search sales..." className="pl-8 w-64" />
                </div>
                <Button variant="outline">
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>A list of your recent sales</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.customer}</div>
                        <div className="text-sm text-gray-500">
                          {sale.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          sale.status === "Completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : sale.status === "Processing"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Send invoice</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Cancel order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">Showing 5 recent sales</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
};

export default Dashboard;
