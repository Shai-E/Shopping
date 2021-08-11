export default interface Product {
    name: string;
    price: number;
    category: string | number;
    id?: number;
    picture?: string[];
}
