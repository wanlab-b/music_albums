export const getAlbumCoverUrl = (
  coverUrl: string | null | undefined,
  albumId: string | null | undefined,
  size = 600
): string => {
  if (coverUrl && coverUrl.trim().length > 0) {
    return coverUrl;
  }
  const safeId = albumId && albumId.trim().length > 0 ? albumId : "album";
  return `https://picsum.photos/seed/${encodeURIComponent(safeId)}/${size}/${size}`;
};
