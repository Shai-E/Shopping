export default interface CartItemModel {
    id?: number;//item id 
    productId?: number; 
    cartId?: number;
    date?: Date;
    name?: string; 
    amount?: number; 
    price?: number;
    picture?: string[];
    size?: string;
}