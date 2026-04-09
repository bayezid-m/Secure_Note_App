const rateLimit = require("express-rate-limit");

// security: Generic API rate limiting reduces abuse and automated attacks.
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// security: Stricter auth rate limiting reduces brute-force login attempts.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// security: Extra protection for account creation to reduce abuse/spam accounts.
const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many registration attempts. Please try again later.",
  },
});

module.exports = {
  apiRateLimiter,
  authRateLimiter,
  registerRateLimiter,
};