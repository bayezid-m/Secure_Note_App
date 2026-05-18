const { body, param, validationResult } = require("express-validator");

// security: Central validation error formatter avoids inconsistent validation behavior.
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// security: Registration validation enforces strong password policy and normalized email input.
const validateRegisterInput = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 12, max: 128 })
    .withMessage("Password must be between 12 and 128 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must include at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must include at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must include at least one special character"),

  handleValidationErrors,
];

// security: Login validation ensures predictable and safe input handling.
const validateLoginInput = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 1, max: 128 })
    .withMessage("Password is required"),

  handleValidationErrors,
];

// security: Note validation limits size and trims content to reduce abuse and malformed input.
const validateNoteInput = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  body("content")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 1, max: 5000 })
    .withMessage("Content must be between 1 and 5000 characters"),

  handleValidationErrors,
];

// security: Numeric route parameter validation blocks malformed IDs and abuse cases.
const validateNoteIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid note id"),

  handleValidationErrors,
];

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateNoteInput,
  validateNoteIdParam,
};