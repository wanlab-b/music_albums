import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { Album } from "../types";
import { TEST_DUMMY_ALBUM } from "../constants";

const DB_REF = "albums";

export const getAllAlbums = async (): Promise<Album[]> => {
  if (!database) {
    console.warn("Database not initialized");
    return [TEST_DUMMY_ALBUM];
  }
  
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, DB_REF));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object { id1: album1, id2: album2 } to array [album1, album2]
      const albums = Object.values(data) as Album[];
      if (!albums.some((album) => album.id === TEST_DUMMY_ALBUM.id)) {
        albums.push(TEST_DUMMY_ALBUM);
      }
      return albums;
    } else {
      console.log("No data available");
      return [TEST_DUMMY_ALBUM];
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    return [];
  }
};

export const getAlbumById = async (id: string): Promise<Album | null> => {
  if (id === TEST_DUMMY_ALBUM.id) return TEST_DUMMY_ALBUM;
  if (!database) return null;

  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `${DB_REF}/${id}`));

    if (snapshot.exists()) {
      return snapshot.val() as Album;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
};
