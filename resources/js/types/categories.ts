
export interface Category {
    id: number;
    name: string;
    color:string;
    slug:string
    description?: string;
    image?: string;

}

export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    category_id: number;
    category?: Category;
}

export interface HomeProps {
    categories: Category[];
    featuredProducts?: Product[];
}
