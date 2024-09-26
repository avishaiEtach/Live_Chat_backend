import express from "express";
import UsersController from "../controllers/UsersController";
import { isAuthenticate } from "../middlewares/verifyToken";
const router = express.Router();

router.post("/login", UsersController.login);
router.post("/signup", UsersController.signup);
router.get("/logout", UsersController.logout);
router.get(
  "/getUserForSideBar",
  isAuthenticate,
  UsersController.getUserForSideBar
);

const UsersRouter = router;

export default UsersRouter;
