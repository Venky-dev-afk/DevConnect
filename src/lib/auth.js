import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains user info like id, email
  } catch (err) {
    return null;
  }
}
