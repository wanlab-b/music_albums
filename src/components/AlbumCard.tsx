import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types';
import { Star } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  rank?: number;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, rank }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Link to={`/album/${album.id}`} className="group relative flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-dark-card shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
        <img 
          src={album.coverUrl} 
          alt={album.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {rank && (
          <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full text-white font-bold text-xs border border-white/10">
            {rank}
          </div>
        )}

        <div className={`absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-xs shadow-lg ${getScoreColor(album.criticScore)}`}>
            {album.criticScore}
        </div>
      </div>
      
      <div className="flex flex-col">
        <h3 className="text-sm font-bold text-white truncate pr-2 group-hover:text-primary transition-colors">
          {album.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">{album.artist}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
          <span className="border border-white/10 px-1 py-0.5 rounded">{album.genres[0]}</span>
          <span>{album.releaseDate.split('-')[0]}</span>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;