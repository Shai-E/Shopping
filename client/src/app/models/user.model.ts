export default interface UserModel {
    city?: string;
    email?: string;
    firstName?: string;
    id?: string;
    isAdmin?: boolean;
    lastName?: string;
    password?: string;
    street?: string;
    picture?: string;
    receipts?: {name: string, orderDate: string}[];
    accessToken?: string;
}