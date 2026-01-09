import jwt from "jsonwebtoken";

const authenticateClient = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    console.log("DEBUG: Verifying token with secret:", JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("DEBUG: Token verified successfully. Decoded:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("DEBUG: Token verification failed:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    return res.status(401).json({ message: `Invalid token: ${error.message}. Secret used: ${JWT_SECRET.slice(0, 5)}...` });
  }
};

export { authenticateClient };
