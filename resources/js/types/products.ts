export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  in_stock: boolean;
  category: string | null;
  category_id: number;
  rating: number;
  image?: string | null
  image_url?: string | null;
  reviews_count:number;
}

