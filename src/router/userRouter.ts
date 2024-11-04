import Router from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/auth";
const router = Router();

router.post("/create-user", userController.createUser);
router.post(
  "/change-to-creator",
  authMiddleware,
  userController.changeToCreator
);
router.post(
  "/create-demo-profile",
  authMiddleware,
  userController.createDemoUser
);
router.post("/claim-demo-creator", userController.claimDemoUser);
export default router;
