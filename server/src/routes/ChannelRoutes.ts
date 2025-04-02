import express from "express";
import { channelControllers } from "../controllers";

const router = express.Router();

router.post("/", channelControllers.addUpdateChannel);
router.get("/commands", channelControllers.getCommandsForChannel);
router.post("/commands", channelControllers.addCommandForChannel);
router.delete("/commands", channelControllers.deleteCommandForChannel);
router.get("/quotes", channelControllers.getQuotesForChannel);
router.post("/quotes", channelControllers.addQuotesForChannel);

export { router as ChannelRoutes };
