import Router from "express";
import userController from "../controllers/userController";
const router = Router();

router.post("/create-user", userController.createUser);

export default router;
