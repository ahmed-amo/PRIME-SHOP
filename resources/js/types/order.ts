export interface OrderItem {
    product_name: string
    quantity: number
    price: number
    subtotal: number
    image?: string
  }

export interface Order {
    id:string
    order_number: string
    customer_name: string
    customer_email: string
    shipping_address: string
    total: number
    subtotal: number
    tax: number
    shipping_cost: number
    status: string
    payment_method: string
    created_at: string
    items: OrderItem[]
  }
