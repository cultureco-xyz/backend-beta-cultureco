import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT
export const generateToken = (payload: object, expiresIn = "1h") => {
  if (!JWT_SECRET) {
    throw console.error("🔴 JWT Secret not found 🔴");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Verify JWT
export const verifyToken = (token: string) => {
  if (!JWT_SECRET) {
    throw console.error("🔴 JWT Secret not found 🔴");
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
