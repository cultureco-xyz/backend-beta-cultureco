import { Request, Response } from "express";
import AlbumService from "../services/albumService";

class AlbumController {
  async createAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { name, cover_url } = req.body;
      let userID = req.body.auth_user._id;

      // Validate required fields
      if (!name || !cover_url || !userID) {
        res
          .status(400)
          .json({ message: "name, cover_url, and userID are required" });
        return;
      }

      const album = await AlbumService.createAlbum({ name, cover_url, userID });
      res.status(201).json(album);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: `Error creating album: ${(error as Error).message}` });
    }
  }

  async getUserAlbums(req: Request, res: Response): Promise<void> {
    try {
      const { userID } = req.params;

      if (!userID) {
        res.status(400).json({ message: "userID is required" });
        return;
      }

      const albums = await AlbumService.getUserAlbums(userID);
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({
        message: `Error fetching albums: ${(error as Error).message}`,
      });
    }
  }
}

export default new AlbumController();
