export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string | null;
  category_id: number;
  rating: number;
  image_url?: string | null;
}

