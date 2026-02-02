import { supabase } from "../supabaseClient";
import { Review } from "../types";

const normalizeReview = (row: Record<string, unknown>): Review => {
  const createdAt = (row.created_at as string | undefined) ?? (row.date as string | undefined) ?? "";
  const date = createdAt ? createdAt.slice(0, 10) : "";

  return {
    id: row.id as string,
    username: (row.username as string | undefined) ?? "Unknown",
    rating: Number(row.rating ?? 0),
    content: (row.content as string | undefined) ?? "",
    date,
    avatarUrl: (row.avatar_url as string | undefined) ?? (row.avatarUrl as string | undefined)
  };
};

export const getReviewsByAlbumId = async (albumId: string): Promise<Review[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, album_id, username, rating, content, created_at, avatar_url")
    .eq("album_id", albumId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data ?? []).map((row) => normalizeReview(row as Record<string, unknown>));
};

export const createReview = async (input: {
  albumId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  avatarUrl?: string;
}): Promise<Review | null> => {
  if (!supabase) return null;

  const payload = {
    album_id: input.albumId,
    user_id: input.userId,
    username: input.username,
    rating: input.rating,
    content: input.content,
    avatar_url: input.avatarUrl ?? null
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert(payload)
    .select("id, album_id, username, rating, content, created_at, avatar_url")
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data ? normalizeReview(data as Record<string, unknown>) : null;
};
