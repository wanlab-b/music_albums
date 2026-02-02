import { supabase } from "../supabaseClient";
import { Album } from "../types";
import { TEST_DUMMY_ALBUM } from "../constants";

const normalizeAlbum = (row: Record<string, unknown>): Album => {
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

  return {
    id: row.id as string,
    title: row.title as string,
    artist: row.artist as string,
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

export const getAllAlbums = async (): Promise<Album[]> => {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return import.meta.env.DEV ? [TEST_DUMMY_ALBUM] : [];
  }
  
  try {
    const { data, error } = await supabase.from("albums").select("*");
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    const albums = rows.map((row) => normalizeAlbum(row as Record<string, unknown>));
    if (import.meta.env.DEV && !albums.some((album) => album.id === TEST_DUMMY_ALBUM.id)) {
      albums.push(TEST_DUMMY_ALBUM);
    }
    return albums;
  } catch (error) {
    console.error("Error fetching albums:", error);
    return import.meta.env.DEV ? [TEST_DUMMY_ALBUM] : [];
  }
};

export const getAlbumById = async (id: string): Promise<Album | null> => {
  if (import.meta.env.DEV && id === TEST_DUMMY_ALBUM.id) return TEST_DUMMY_ALBUM;
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeAlbum(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
};
