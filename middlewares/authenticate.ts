import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/config";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, config.jwtSecret!, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: "Unauthorized" });
        }
        //@ts-ignore
        req.user = { userId: decoded.userId };
        next();
      });
    } catch (error) {
      res.status(401).json({ message: "Token invalide" });
    }
  } else {
    res.status(401).json({ message: "Token manquant" });
  }
}
