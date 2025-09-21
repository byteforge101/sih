export declare function addProduct(formData: FormData): Promise<{
    productId: string;
}>;
export declare function getProducts(): Promise<({
    images: {
        id: string;
        url: string;
        productId: string;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    mentorId: string;
    description: string;
    price: number;
})[]>;
export declare function getProduct(productId: string): Promise<({
    images: {
        id: string;
        url: string;
        productId: string;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    mentorId: string;
    description: string;
    price: number;
}) | null>;
export declare function addToCart(productId: string): Promise<void>;
export declare function getCart(): Promise<({
    items: ({
        product: {
            images: {
                id: string;
                url: string;
                productId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            mentorId: string;
            description: string;
            price: number;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        cartId: string;
        quantity: number;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
}) | null>;
export declare function removeFromCart(cartItemId: string): Promise<void>;
export declare function createOrder(): Promise<void>;
export declare function getOrders(): Promise<({
    items: ({
        product: {
            images: {
                id: string;
                url: string;
                productId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            mentorId: string;
            description: string;
            price: number;
        };
    } & {
        id: string;
        price: number;
        productId: string;
        quantity: number;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    studentId: string;
    totalPoints: number;
})[]>;
//# sourceMappingURL=actions.d.ts.map