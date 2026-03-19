const errorHandler = (err, req, res, next) => {
  console.error("Server error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    time: new Date().toISOString(),
  });

  if (err.code === "23505") {
    return res.status(409).json({
      message: "Resource already exists",
    });
  }

  if (err.code === "22P02") {
    return res.status(400).json({
      message: "Invalid input format",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;