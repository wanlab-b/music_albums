import React from 'react';
import { Review } from '../types';
import { ThumbsUp, MessageCircle } from 'lucide-react';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-dark-card border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex-shrink-0">
        <img 
          src={review.avatarUrl} 
          alt={review.username} 
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">{review.username}</span>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
            <span className="text-xs font-bold text-primary">{review.rating}</span>
            <span className="text-[10px] text-gray-400">/ 100</span>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          {review.content}
        </p>
        <div className="flex items-center gap-4 text-gray-500">
          <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>유용해요</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>댓글</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;