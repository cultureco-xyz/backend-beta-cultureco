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
router.post("/verify-claim-code", userController.verifyClaimCode);
router.post(
  "/claim-demo-creator",
  authMiddleware,
  userController.claimDemoUser
);
router.post("/get-user-by-id", userController.getUserByID);
router.get("/get-all-creators", userController.getAllUser);
router.get("/get-creator-stats/:id", userController.getCreatorStats);
router.get("/get-user-stats/:id", userController.getUserStats);
router.post("/update-profile", authMiddleware, userController.updateProfile);
router.post("/check-username", userController.checkUsernameAvailability);

export default router;
