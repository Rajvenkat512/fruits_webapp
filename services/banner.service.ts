import api from "./api";

export interface Banner {
    _id: string;
    title: string;
    image: string;
    description?: string;
    isActive: boolean;
    order?: number;
}

export const bannerService = {
    // Get all active banners
    getAll: async (): Promise<Banner[]> => {
        try {
            const response = await api.get<Banner[]>("/admin/banners");
            return response.data;
        } catch (error) {
            console.error("Failed to fetch banners", error);
            return [];
        }
    },
};
