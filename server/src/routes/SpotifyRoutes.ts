import express from "express";
import { spotifyControllers } from "../controllers";

const router = express.Router();

router.get("/title", spotifyControllers.getTitle);

export { router as SpotifyRoutes };
