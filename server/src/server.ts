import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { queueControllers } from "./controllers";
import { authMiddleware } from "./middleware/auth";
import { rateLimiter } from "./middleware/rate-limiter";
import { ChannelRoutes } from "./routes/ChannelRoutes";
import { QueueRoutes } from "./routes/QueueRoutes";
import { SpotifyRoutes } from "./routes/SpotifyRoutes";
import { config } from "./utils/config";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        login: string;
        scopes: string[];
      };
    }
  }
}

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

const router = express.Router();
const publicRouter = express.Router();

// Authenticated routes
router.use("/channel", ChannelRoutes);
router.use("/queue", QueueRoutes);
router.use("/spotify", SpotifyRoutes);
router.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});
router.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

// Public routes
publicRouter.get("/queue/:channel", queueControllers.getQueueByChannel);

app.use("/api/public", rateLimiter, publicRouter);
app.use("/api", authMiddleware, rateLimiter, router);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
