import { supabase } from "../supabaseClient";
import { AlbumTrack, Track } from "../types";

export const getAlbumTracks = async (albumId: string): Promise<AlbumTrack[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bugs_album_tracks")
    .select("id, album_id, track_no, track_title")
    .eq("album_id", albumId)
    .order("track_no", { ascending: true });

  if (error) {
    console.error("Error fetching album tracks:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    albumId: row.album_id as string,
    trackNo: (row.track_no as number | null) ?? null,
    title: row.track_title as string
  }));
};

export const getTracksByArtistId = async (artistId: string): Promise<Track[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bugs_tracks")
    .select("id, title, duration, album_id, artist_id")
    .eq("artist_id", artistId)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching artist tracks:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    duration: (row.duration as string | null) ?? null,
    albumId: (row.album_id as string | null) ?? null,
    artistId: (row.artist_id as string | null) ?? null
  }));
};
