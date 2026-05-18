export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? '' : 'Invalid email format';
}

export function validatePasswordForRegister(password) {
  if (!password) return 'Password is required';
  if (password.length < 12 || password.length > 128) {
    return 'Password must be between 12 and 128 characters';
  }
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character';
  }
  return '';
}

export function validatePasswordForLogin(password) {
  if (!password) return 'Password is required';
  if (password.length > 128) return 'Password is too long';
  return '';
}

export function validateNote(title, content) {
  const errors = {};

  const safeTitle = title.trim();
  const safeContent = content.trim();

  if (!safeTitle) {
    errors.title = 'Title is required';
  } else if (safeTitle.length > 255) {
    errors.title = 'Title must be between 1 and 255 characters';
  }

  if (!safeContent) {
    errors.content = 'Content is required';
  } else if (safeContent.length > 5000) {
    errors.content = 'Content must be between 1 and 5000 characters';
  }

  return errors;
}

export function normalizeAuthPayload(email, password) {
  return {
    email: email.trim().toLowerCase(),
    password,
  };
}

export function normalizeNotePayload(title, content) {
  return {
    title: title.trim(),
    content: content.trim(),
  };
}
