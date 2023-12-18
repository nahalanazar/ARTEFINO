export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (/\d/.test(name)) {
    return 'Name should not contain numbers';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email is not valid';
  }
  return '';
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return 'Mobile number should have 10 digits';
  }
  return '';
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password should contain at least 8 characters, one number, and a special character';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Passwords do not match'
    }
    return '';
}

export const loginValidateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  return '';
};

export const loginValidatePassword = (password) => {
  if (!password || password.trim().length === 0) {
    return 'Password is required';
  }
  return '';
};