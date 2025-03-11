import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../interface/AuthenticatedRequest ";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

interface JwtPayload {
  id: number;
  email: string;
  // iat: number;
  // exp: number;
}

const authMiddleware: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Token not found" });
      return;
    }

    // Expect header seperti: 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Incorrect token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "TOKEN_EXPIRED" });
    }
    res.status(401).json({ message: "INVALID_TOKEN" });
  }
};
export default authMiddleware;
