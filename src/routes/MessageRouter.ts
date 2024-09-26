import express from "express";
import MessageController from "../controllers/MessageController";
import { isAuthenticate } from "../middlewares/verifyToken";
const router = express.Router();

router.get("/getMessage/:id", isAuthenticate, MessageController.getMessage);
router.post("/send/:id", isAuthenticate, MessageController.sendMessage);

const MessageRouter = router;

export default MessageRouter;
