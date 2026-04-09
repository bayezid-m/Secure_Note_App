const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../middleWares/validationMiddleware");
const {
  authRateLimiter,
  registerRateLimiter,
} = require("../middleWares/rateLimiter");

const router = express.Router();

// security: Rate-limit for registration endpoint to reduce automated account creation.
router.post("/register", registerRateLimiter, validateRegisterInput, register);

// security: Rate-limit for login endpoint to reduce brute-force attacks.
router.post("/login", authRateLimiter, validateLoginInput, login);

module.exports = router;