
export interface Category {
    id: number;
    name: string;
    color:string;
    slug:string
    description:string;
    status: string;
    image?: string;
    image_url?: string;
    size?: "small" | "medium" | "large";
}

