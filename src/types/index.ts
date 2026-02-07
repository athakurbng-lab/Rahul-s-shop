export interface Category {
    id: number;
    name: string;
    image_url: string;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    image_url: string;
    price: number;
    discount: number;
    in_stock: boolean;
}
