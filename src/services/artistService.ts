import { supabase } from "../supabaseClient";
import { Album, Artist } from "../types";
import { normalizeAlbum } from "./albumMapping";

export const getArtistById = async (artistId: string): Promise<Artist | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("bugs_artists")
    .select("id, name")
    .eq("id", artistId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching artist:", error);
    return null;
  }

  return data ? ({ id: data.id as string, name: data.name as string } as Artist) : null;
};

export const getAlbumsByArtistId = async (artistId: string): Promise<Album[]> => {
  if (!supabase) return [];

  const { data: baseRows, error: baseError } = await supabase
    .from("bugs_albums")
    .select("id")
    .eq("artist_id", artistId);

  if (baseError) {
    console.error("Error fetching artist albums:", baseError);
    return [];
  }

  const ids = (baseRows ?? []).map((row) => row.id as string).filter(Boolean);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("bugs_albums_view")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching artist albums view:", error);
    return [];
  }

  return (data ?? []).map((row) => normalizeAlbum(row as Record<string, unknown>));
};
