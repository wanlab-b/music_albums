import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentReviews } from '@/services/reviewService';
import { Review } from '@/types';
import { Loader2 } from 'lucide-react';

const ReviewerOfMonth: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getRecentReviews(500);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const reviewers = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; avatar?: string; reviews: number; totalRating: number }
    >();

    reviews.forEach((review) => {
      const key = review.userId ?? review.username;
      const current = map.get(key);
      if (current) {
        current.reviews += 1;
        current.totalRating += review.rating;
      } else {
        map.set(key, {
          id: key,
          name: review.username,
          avatar: review.avatarUrl,
          reviews: 1,
          totalRating: review.rating
        });
      }
    });

    return [...map.values()]
      .map((item) => ({
        ...item,
        level: item.reviews >= 20 ? "Expert" : item.reviews >= 10 ? "Pro" : "Rookie",
        avgRating: item.reviews > 0 ? Math.round(item.totalRating / item.reviews) : 0
      }))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 12);
  }, [reviews]);

  const avatarFor = (name: string, url?: string) => {
    if (url && url.trim().length > 0) return url;
    return `https://picsum.photos/seed/${encodeURIComponent(name)}/120/120`;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-black text-white mb-6">이달의 리뷰어</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviewers.length > 0 ? reviewers.map(reviewer => (
          <Link to={`/user/${reviewer.id}`} key={reviewer.id} className="bg-dark-card rounded-2xl p-6 border border-white/5 text-center block hover:border-primary/50 transition-colors">
            <img src={avatarFor(reviewer.name, reviewer.avatar)} alt={reviewer.name} className="w-24 h-24 rounded-full mx-auto mb-4 ring-2 ring-primary/50" />
            <h3 className="text-lg font-bold text-white">{reviewer.name}</h3>
            <p className="text-indigo-400 text-sm">{reviewer.level}</p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
              <div>
                <span className="font-bold text-white">{reviewer.reviews}</span> Reviews
              </div>
              <div>
                <span className="font-bold text-white">{reviewer.avgRating}</span> Avg Rating
              </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            아직 등록된 리뷰어 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerOfMonth;
