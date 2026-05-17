import React, { useState, useEffect, useCallback } from 'react';
import { 
    Star, 
    MessageSquare, 
    Send, 
    Trash2, 
    Loader2, 
    ChevronLeft, 
    ChevronRight, 
    AlertCircle,
    User
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/slices/store.ts';
import { 
    getTemplateReviews, 
    getMyReview, 
    upsertReview, 
    deleteReview, 
    Review, 
    ReviewStats 
} from '@src/services/reviewService';
import { toast } from 'react-hot-toast';

interface TemplateReviewsProps {
    templateId: string;
}

const TemplateReviews: React.FC<TemplateReviewsProps> = ({ templateId }) => {
    const { isAuthenticated, user: currentUser } = useSelector((state: RootState) => state.auth);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
    const [myReview, setMyReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = useCallback(async (p: number) => {
        try {
            const data = await getTemplateReviews(templateId, p);
            setReviews(data.reviews);
            setStats({ averageRating: data.averageRating, totalReviews: data.totalReviews });
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        }
    }, [templateId]);

    const fetchUserReview = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await getMyReview(templateId);
            if (data.review) {
                setMyReview(data.review);
                setRating(data.review.rating);
                setReviewText(data.review.reviewText);
            }
        } catch (err) {
            console.error('Failed to fetch user review:', err);
        }
    }, [templateId, isAuthenticated]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchReviews(1), fetchUserReview()]);
            setLoading(false);
        };
        init();
    }, [fetchReviews, fetchUserReview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please sign in to leave a review');
            return;
        }
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            const data = await upsertReview(templateId, rating, reviewText);
            setMyReview(data.review);
            setStats({ averageRating: data.averageRating, totalReviews: data.totalReviews });
            toast.success(myReview ? 'Review updated' : 'Review submitted');
            fetchReviews(1); // Refresh first page
            setPage(1);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your review?')) return;
        
        try {
            const data = await deleteReview(templateId);
            setMyReview(null);
            setRating(0);
            setReviewText('');
            setStats({ averageRating: data.averageRating, totalReviews: data.totalReviews });
            toast.success('Review deleted');
            fetchReviews(1);
            setPage(1);
        } catch (err) {
            toast.error('Failed to delete review');
        }
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        fetchReviews(p);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="mt-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="size-6 text-primary-500" />
                        Reviews & Ratings
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        See what others think about this template
                    </p>
                </div>
                
                {stats.totalReviews > 0 && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                            <div className="flex items-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`size-3.5 ${star <= Math.round(stats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-100" />
                        <div className="text-sm text-gray-500">
                            <span className="font-bold text-gray-900 block">{stats.totalReviews}</span>
                            Total Reviews
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {myReview ? 'Edit your review' : 'Leave a review'}
                        </h3>
                        
                        {!isAuthenticated ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                                <p className="text-sm text-amber-800 mb-3">You must be signed in to rate this template.</p>
                                <button 
                                    onClick={() => window.location.href = '/auth/sign-in'}
                                    className="text-sm font-bold text-primary-600 hover:underline"
                                >
                                    Sign In Now
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star 
                                                    className={`size-8 transition-colors ${
                                                        star <= (hoverRating || rating) 
                                                            ? 'fill-amber-400 text-amber-400' 
                                                            : 'text-gray-300 hover:text-gray-400'
                                                    }`} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Review (optional)</label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="What did you like or dislike about this template?"
                                        rows={4}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>
                                
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0}
                                        className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                                        {myReview ? 'Update Review' : 'Submit Review'}
                                    </button>
                                    
                                    {myReview && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                            title="Delete review"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 py-16 px-6 text-center">
                            <div className="size-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Star className="size-8 text-gray-300" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">No reviews yet</h4>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                Be the first one to rate this template and help others choose the right design!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {review.user.profilePic ? (
                                                        <img src={review.user.profilePic} alt={review.user.username} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="size-5 text-primary-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">{review.user.username}</div>
                                                    <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg">
                                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-bold text-amber-700">{review.rating}</span>
                                            </div>
                                        </div>
                                        
                                        {review.reviewText && (
                                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                                {review.reviewText}
                                            </p>
                                        )}
                                        
                                        {currentUser && currentUser._id === review.user._id && (
                                            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary-500 uppercase tracking-wider bg-primary-50 w-fit px-2 py-0.5 rounded">
                                                Your Review
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 pt-4">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => handlePageChange(page - 1)}
                                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => handlePageChange(page + 1)}
                                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateReviews;
