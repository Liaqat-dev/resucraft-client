import api from '@src/utils/axios_api';

export interface ReviewUser {
    _id: string;
    username: string;
    profilePic: string | null;
}

export interface Review {
    _id: string;
    templateId: string;
    rating: number;
    reviewText: string;
    createdAt: string;
    updatedAt: string;
    user: ReviewUser;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

export interface ReviewsResponse extends ReviewStats {
    success: boolean;
    templateId: string;
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
    };
}

export const getTemplateReviews = async (templateId: string, page = 1, limit = 10) => {
    const res = await api.get(`/reviews/${templateId}`, { params: { page, limit } });
    return res.data as ReviewsResponse;
};

export const getMyReview = async (templateId: string) => {
    const res = await api.get(`/reviews/${templateId}/my-review`);
    return res.data as { success: boolean; review: Review | null };
};

export const upsertReview = async (templateId: string, rating: number, reviewText: string) => {
    const res = await api.post(`/reviews/${templateId}`, { rating, reviewText });
    return res.data as { success: boolean; message: string; review: Review; averageRating: number; totalReviews: number };
};

export const deleteReview = async (templateId: string) => {
    const res = await api.delete(`/reviews/${templateId}`);
    return res.data as { success: boolean; message: string; averageRating: number; totalReviews: number };
};
