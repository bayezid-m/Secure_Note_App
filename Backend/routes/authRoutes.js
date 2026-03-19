const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../middleWares/validationMiddleware");
const { authRateLimiter } = require("../middleWares/rateLimiter");

const router = express.Router();

router.post("/register", validateRegisterInput, register);
router.post("/login", authRateLimiter, validateLoginInput, login);

module.exports = router;