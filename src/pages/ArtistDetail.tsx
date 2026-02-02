import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlbumCard from "@/components/AlbumCard";
import { getArtistById, getAlbumsByArtistId } from "@/services/artistService";
import { getTracksByArtistId } from "@/services/trackService";
import { Album, Artist, Track } from "@/types";
import { Loader2, Music2 } from "lucide-react";

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const [artistData, artistAlbums, artistTracks] = await Promise.all([
        getArtistById(id),
        getAlbumsByArtistId(id),
        getTracksByArtistId(id)
      ]);
      setArtist(artistData);
      setAlbums(artistAlbums);
      setTracks(artistTracks);
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">아티스트를 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-6">요청하신 아티스트 정보가 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/" className="text-primary hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-dark-card border border-white/10 flex items-center justify-center">
          <Music2 className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{artist.name}</h1>
          <p className="text-sm text-gray-400 mt-1">Albums: {albums.length} · Tracks: {tracks.length}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">앨범</h2>
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">등록된 앨범이 없습니다.</div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">트랙</h2>
        {tracks.length > 0 ? (
          <div className="bg-dark-card rounded-xl border border-white/5 overflow-hidden">
            <ul className="divide-y divide-white/5">
              {tracks.map((track, idx) => (
                <li key={track.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-gray-500 w-6 text-center text-sm">{idx + 1}</span>
                    <span className="text-gray-200 font-medium text-sm line-clamp-1">{track.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{track.duration ?? "-"}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">등록된 트랙이 없습니다.</div>
        )}
      </section>
    </div>
  );
};

export default ArtistDetail;
