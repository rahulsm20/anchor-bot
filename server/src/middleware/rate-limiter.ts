import { NextFunction, Request, Response } from "express";
import { limit } from "../lib/limiter";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.login || req.ip || "anonymous";
    const result = await limit.get(id, 20, 60);

    const { remaining = 0 } = result;

    res.set("X-RateLimit-Limit", "5");
    res.set("X-RateLimit-Remaining", remaining.toString());
    res.set(
      "X-RateLimit-Reset",
      (Math.floor(Date.now() / 1000) + 60).toString()
    );

    if (remaining > 0) {
      return next();
    } else {
      const resetTime = (Math.floor(Date.now() / 1000) + 60) * 1000;
      const delta = resetTime - Date.now();
      const after = Math.ceil(delta / 1000);
      res.set("Retry-After", after.toString());
      return res
        .status(429)
        .send(`Rate limit exceeded. Retry in ${after} seconds.`);
    }
  } catch (err) {
    return next(err);
  }
};
