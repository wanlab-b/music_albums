import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AlbumCard from "@/components/AlbumCard";
import { getAllAlbums } from "@/services/albumService";
import { Album } from "@/types";
import { Loader2 } from "lucide-react";

type GenrePageProps = {
  title: string;
  genre: string;
  description: string;
};

const normalizeGenres = (genres: string[]): string[] => {
  const parts: string[] = [];
  genres.forEach((g) => {
    g.split(/[,/]/).forEach((piece) => {
      const trimmed = piece.trim();
      if (trimmed) parts.push(trimmed);
    });
  });
  return parts;
};

const GenrePage: React.FC<GenrePageProps> = ({ title, genre, description }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const data = await getAllAlbums();
      setAlbums(data);
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  const filtered = useMemo(() => {
    const target = genre.toLowerCase();
    return albums.filter((album) => {
      const normalized = normalizeGenres(album.genres || []);
      return normalized.some((g) => g.toLowerCase().includes(target));
    });
  }, [albums, genre]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">{title}</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">{description}</p>
        </div>
        <Link to={`/search?q=${encodeURIComponent(genre)}`} className="text-sm text-gray-400 hover:text-white">
          전체 보기
        </Link>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">이 장르에 등록된 앨범이 없습니다.</div>
      )}
    </div>
  );
};

export default GenrePage;
