const jwt = require("jsonwebtoken");
const env = require("../config/env");

// security: Strict JWT verification checks signature, expiry, issuer, and audience.
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, env.jwtSecret, {
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    });

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protect };