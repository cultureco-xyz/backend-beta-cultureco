import authController from "../controllers/authController";
import { Router } from "express";
import authService from "../services/authService";

let router = Router();

router.post("/signin", authController.signin);
router.post("/signin-wallet", authController.signinWallet);
router.get("/logedin", authController.isLogedIn);
router.get("/logout", authController.logOut);

export default router;
