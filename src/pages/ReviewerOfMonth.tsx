import React from 'react';

const ReviewerOfMonth: React.FC = () => {
  // Mock Data for Top Reviewers - can be expanded
  const reviewers = [
    { id: 1, name: 'IndieLover', avatar: 'https://picsum.photos/100/100?random=20', reviews: 142, followers: 890, level: 'Expert' },
    { id: 2, name: 'KpopMaster', avatar: 'https://picsum.photos/100/100?random=21', reviews: 98, followers: 1200, level: 'Pro' },
    { id: 3, name: 'JazzCat', avatar: 'https://picsum.photos/100/100?random=22', reviews: 340, followers: 450, level: 'Critic' },
    { id: 4, name: 'NewWave', avatar: 'https://picsum.photos/100/100?random=23', reviews: 67, followers: 230, level: 'Rookie' },
    { id: 5, name: 'RockFan', avatar: 'https://picsum.photos/100/100?random=24', reviews: 210, followers: 600, level: 'Pro' },
    { id: 6, name: 'HipHopHead', avatar: 'https://picsum.photos/100/100?random=25', reviews: 180, followers: 500, level: 'Pro' },

  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-black text-white mb-6">이달의 리뷰어</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviewers.map(reviewer => (
          <div key={reviewer.id} className="bg-dark-card rounded-2xl p-6 border border-white/5 text-center">
            <img src={reviewer.avatar} alt={reviewer.name} className="w-24 h-24 rounded-full mx-auto mb-4 ring-2 ring-primary/50" />
            <h3 className="text-lg font-bold text-white">{reviewer.name}</h3>
            <p className="text-indigo-400 text-sm">{reviewer.level}</p>
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
              <div>
                <span className="font-bold text-white">{reviewer.reviews}</span> Reviews
              </div>
              <div>
                <span className="font-bold text-white">{reviewer.followers}</span> Followers
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewerOfMonth;
