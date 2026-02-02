import { supabase } from "../supabaseClient";
import { Album } from "../types";
import { TEST_DUMMY_ALBUM } from "../constants";
import { normalizeAlbum } from "./albumMapping";

export const getAllAlbums = async (): Promise<Album[]> => {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return import.meta.env.DEV ? [TEST_DUMMY_ALBUM] : [];
  }
  
  try {
    const { data, error } = await supabase.from("bugs_albums_view").select("*");
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
      .from("bugs_albums_view")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const album = normalizeAlbum(data as Record<string, unknown>);

    const { data: baseRow, error: baseError } = await supabase
      .from("bugs_albums")
      .select("artist_id")
      .eq("id", id)
      .maybeSingle();
    if (!baseError && baseRow?.artist_id) {
      album.artistId = baseRow.artist_id as string;
    }

    return album;
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
};
