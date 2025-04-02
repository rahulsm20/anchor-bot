import express from "express";
import { queueControllers } from "../controllers";

const router = express.Router();

router.get("/", queueControllers.getQueue);
router.post("/add", queueControllers.addToQueue);
router.delete("/remove", queueControllers.popFromQueue);
export { router as QueueRoutes };
