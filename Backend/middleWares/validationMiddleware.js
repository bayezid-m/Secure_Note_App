const validateRegisterInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long",
        });
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        return res.status(400).json({
            message:
                "Password must include uppercase, lowercase, number, and special character",
        });
    }

    next();
};

const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    next();
};

const validateNoteInput = (req, res, next) => {
    const { title, content } = req.body;

    if (
        typeof title !== "string" ||
        typeof content !== "string"
    ) {
        return res.status(400).json({
            message: "Title and content must be in string format",
        });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
        return res.status(400).json({
            message: "Title and content are required",
        });
    }

    if (trimmedTitle.length > 255) {
        return res.status(400).json({
            message: "Title must not exceed 255 characters",
        });
    }

    if (trimmedContent.length > 5000) {
        return res.status(400).json({
            message: "Content must not exceed 5000 characters",
        });
    }

    req.body.title = trimmedTitle;
    req.body.content = trimmedContent;

    next();
};

const validateNoteIdParam = (req, res, next) => {
    const { id } = req.params;

    const noteId = Number(id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
        return res.status(400).json({
            message: "Invalid note id",
        });
    }

    req.params.id = noteId;
    next();
};

module.exports = {
    validateRegisterInput,
    validateLoginInput,
    validateNoteInput,
    validateNoteIdParam,
};