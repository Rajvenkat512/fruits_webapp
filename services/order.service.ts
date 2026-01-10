import api from "./api";

export interface OrderItem {
    productId: string;
    quantity: number;
}

export interface ShippingAddress {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
}

export interface GenericOrderPayload {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    code?: string;
}

export interface OrderResponse {
    id: string;
    userId: string;
    total: number;
    status: string;
    createdAt: string;
    // ... other fields as needed
}

export interface OrderDetail extends OrderResponse {
    items: {
        id: string;
        productId: string;
        price: number;
        quantity: number;
        product: {
            name: string;
            image: string;
        };
    }[];
    shippingAddress: ShippingAddress[]; // Updated to Array based on API response
    payments: {
        method: string;
        amount: number;
        status: string;
    }[];
    couponId: string | null;
    updatedAt: string;
}

export const orderService = {
    createOrder: async (payload: GenericOrderPayload): Promise<OrderResponse> => {
        const response = await api.post<OrderResponse>("/orders", payload);
        return response.data;
    },

    getOrder: async (id: string): Promise<OrderDetail> => {
        const response = await api.get<OrderDetail>(`/orders/${id}`);
        return response.data;
    },

    getOrders: async (): Promise<OrderResponse[]> => {
        const response = await api.get<OrderResponse[]>("/orders");
        return response.data;
    },
};
