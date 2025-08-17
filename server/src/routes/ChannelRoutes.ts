import express from "express";
import { channelControllers } from "../controllers";

const router = express.Router();

router.get("/commands", channelControllers.getCommandsForChannel);
router.post("/commands", channelControllers.addCommandForChannel);
router.post("/permissions", channelControllers.addUpdatePermissions);
router.get("/permissions", channelControllers.getPermissions);
router.delete("/commands/:id", channelControllers.deleteCommandForChannel);
router.get("/quotes", channelControllers.getQuotesForChannel);
router.post("/quotes", channelControllers.addQuotesForChannel);

export { router as ChannelRoutes };
