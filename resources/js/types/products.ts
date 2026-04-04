export interface ProductReviewItem {
  id: number;
  rating: number;
  body: string | null;
  created_at: string | null;
  user: { name: string; avatar_url: string | null };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  /** Amount the customer pays (active / sale price). */
  price: number;
  list_price?: number;
  compare_at_price?: number | null;
  original_display_price?: number | null;
  is_on_sale?: boolean;
  is_on_sale_effective?: boolean;
  discount_percentage?: number;
  stock: number;
  in_stock: boolean;
  category: string | null;
  category_id: number;
  rating: number;
  image?: string | null;
  image_url?: string | null;
  reviews_count: number;
  /** Populated on product detail page */
  reviews_list?: ProductReviewItem[];
  can_review?: boolean;
  user_review?: { id: number; rating: number; body: string | null } | null;
  images?: string[];
  /** ISO 8601 end time when a scheduled sale has an end date. */
  sale_ends_at?: string | null;
  sale_enabled?: boolean;
  /** Present when the product is sold by a vendor with a reachable WhatsApp number. */
  vendor_whatsapp_url?: string | null;
}

export interface SalesProduct {
    id: number;
    name: string;
    slug: string;
    originalPrice: number;
    price: number;
    discountPercentage: number;
    description: string;
    image_url: string | null;
    category: string | null;
    rating: number;
    stock: number;
  }
