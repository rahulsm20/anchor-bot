import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { authMiddleware } from "./middleware/auth";
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

router.use("/channel", ChannelRoutes);
router.use("/queue", QueueRoutes);
router.use("/spotify", SpotifyRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

app.use("/api", authMiddleware, router);

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
