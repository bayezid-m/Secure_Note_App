const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const logger = require("../utils/logger");
const { findUserByEmail, createUser } = require("../model/userModel");

// security: JWT with strict claims to make token validation more robust.
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
};

const register = async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      // security: Avoids exposing whether extra account details exist beyond duplicate email conflict.
      return res.status(409).json({ message: "Email is already registered" });
    }

    // security: Strong password hashing with configurable work factor.
    const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

    const newUser = await createUser(email, passwordHash);

    logger.info("User registered", {
      requestId: req.requestId,
      userId: newUser.id,
      email: newUser.email,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await findUserByEmail(email);

    // security: Returns the same generic message for unknown email and wrong password.
    if (!user) {
      logger.warn("Failed login attempt", {
        requestId: req.requestId,
        email,
        reason: "user_not_found",
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      logger.warn("Failed login attempt", {
        requestId: req.requestId,
        email,
        reason: "invalid_password",
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAccessToken(user);

    logger.info("User login successful", {
      requestId: req.requestId,
      userId: user.id,
      email: user.email,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};