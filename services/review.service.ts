import api from "./api";

export interface ReviewPayload {
    productId: string;
    rating: number;
    comment: string;
}

export interface ReviewResponse {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
}

export const reviewService = {
    createReview: async (payload: ReviewPayload): Promise<ReviewResponse> => {
        const response = await api.post<ReviewResponse>("/reviews", payload);
        return response.data;
    },

    getReviews: async (productId: string): Promise<ReviewResponse[]> => {
        const response = await api.get<ReviewResponse[]>(`/reviews?productId=${productId}`);
        return response.data;
    },
};
