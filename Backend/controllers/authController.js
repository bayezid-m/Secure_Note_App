const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  createUser,
} = require("../model/userModel");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const mainEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(mainEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser(mainEmail, passwordHash);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const mainEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(mainEmail);

    if (!user) {
      console.warn(`Failed login attempt for email: ${mainEmail}`);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      console.warn(`Failed login attempt for email: ${mainEmail}`);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.status(200).json({
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