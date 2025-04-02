import { NextFunction, Request, Response } from "express";
import { verifyTwitchToken } from "../utils/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.headers.authorization?.split(" ")[1];
    if (!sessionToken) {
      throw new Error("Please provide a session token");
    }
    const verified = await verifyTwitchToken(sessionToken);
    if (verified) {
      req.user = verified;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
