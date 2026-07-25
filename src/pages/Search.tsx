import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AlbumCard from '@/components/AlbumCard';
import { getAllAlbums } from '@/services/albumService';
import { Album } from '@/types';
import { Loader2 } from 'lucide-react';
import { trackItemListView, trackSearchResultsLoaded } from '@/analytics';

const Search: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const query = (searchParams.get('q') || '').trim();
  const normalizedQuery = query.toLowerCase();

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      const data = await getAllAlbums();
      setAlbums(data);
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return albums
      .filter((album) => {
        const matchesTitle = album.title?.toLowerCase().includes(normalizedQuery);
        const matchesArtist = album.artist?.toLowerCase().includes(normalizedQuery);
        const matchesGenres = (album.genres || []).some((genre) =>
          genre.toLowerCase().includes(normalizedQuery)
        );
        const matchesTracks = (album.tracks || []).some((track) =>
          track.toLowerCase().includes(normalizedQuery)
        );
        return matchesTitle || matchesArtist || matchesGenres || matchesTracks;
      })
      .sort((a, b) => b.criticScore - a.criticScore);
  }, [albums, normalizedQuery]);

  useEffect(() => {
    if (loading || !query) return;

    trackSearchResultsLoaded({
      queryLength: query.length,
      resultCount: results.length,
      navigationKey: location.key
    });

    if (results.length > 0) {
      trackItemListView({
        itemListId: 'search_results',
        itemListName: 'Search results',
        items: results.map((album) => ({
          id: album.id,
          title: album.title,
          artist: album.artist,
          genre: album.genres?.[0]
        })),
        navigationKey: location.key,
        component: 'Search'
      });
    }
  }, [loading, location.key, query, results]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">검색 결과</h1>
          <p className="text-sm text-gray-400 mt-2">
            {query ? (
              <>
                "{query}"에 대한 결과 {results.length}개
              </>
            ) : (
              '검색어를 입력해 주세요.'
            )}
          </p>
        </div>
      </div>

      {query ? (
        results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                index={index}
                itemListId="search_results"
                itemListName="Search results"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg font-bold">결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 키워드로 다시 검색해 보세요.</p>
          </div>
        )
      ) : (
        <div className="text-center text-gray-400 py-16">
          <p className="text-lg font-bold">검색어가 비어 있습니다.</p>
          <p className="text-sm mt-2">상단 검색창에 키워드를 입력해 주세요.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
