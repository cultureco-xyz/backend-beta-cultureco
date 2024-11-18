import { Document, Types } from "mongoose";
import AlbumModel from "../models/AlbumModel"; // Adjust the path based on your project structure

// Define the album data type
interface AlbumData {
  name: string;
  cover_url: string;
  userID: Types.ObjectId;
}

interface AlbumDocument extends Document, AlbumData {}

// AlbumService class
class AlbumService {
  async createAlbum(albumData: AlbumData): Promise<any> {
    try {
      const album = new AlbumModel(albumData);
      return await album.save();
    } catch (error) {
      throw new Error(`Error creating album: ${(error as Error).message}`);
    }
  }

  async getUserAlbums(userID: string): Promise<AlbumDocument[]> {
    try {
      return await AlbumModel.find({ userID });
    } catch (error) {
      throw new Error(`Error fetching albums: ${(error as Error).message}`);
    }
  }
}

export default new AlbumService();
