import { Request, Response, NextFunction } from "express";

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.ADMIN_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  next();
};
