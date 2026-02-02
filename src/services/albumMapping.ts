import { Album } from "../types";

export const normalizeAlbum = (row: Record<string, unknown>): Album => {
  const releaseDate =
    (row.releaseDate as string | undefined) ?? (row.release_date as string | undefined) ?? "";
  const coverUrl =
    (row.coverUrl as string | undefined) ?? (row.cover_url as string | undefined) ?? "";
  const criticScore =
    (row.criticScore as number | undefined) ?? (row.critic_score as number | undefined) ?? 0;
  const userScore =
    (row.userScore as number | undefined) ?? (row.user_score as number | undefined) ?? 0;
  const genres = (row.genres as string[] | undefined) ?? [];
  const tracks = (row.tracks as string[] | undefined) ?? undefined;
  const artistId =
    (row.artistId as string | undefined) ?? (row.artist_id as string | undefined) ?? undefined;

  return {
    id: row.id as string,
    title: row.title as string,
    artist: row.artist as string,
    artistId,
    type: row.type as string | undefined,
    releaseDate,
    coverUrl,
    genres,
    criticScore,
    userScore,
    description: row.description as string | undefined,
    tracks
  };
};
