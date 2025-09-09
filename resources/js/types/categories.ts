export interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    color: string;
  }

  export interface CreateCategory {
    name: string;
    slug: string;
    image: File | null; 
    color: string;
  }
