import express from "express";
import AlbumController from "../controllers/albumController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/create", authMiddleware, AlbumController.createAlbum); // Endpoint to create an album
router.get("/users/:userID", AlbumController.getUserAlbums); // Endpoint to get albums by userID

export default router;
