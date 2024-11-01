import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.Authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Replace 'verifyToken' with your actual token verification logic
    const decoded = verifyToken(`${token}`); // Implement or import verifyToken function

    // Attach user data to request if needed
    let user = decoded;
    req.body = { ...req.body, auth_user: user };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
