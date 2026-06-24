/**
 * Form validation helper functions
 */

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address format";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) return "Phone number must be at least 10 digits";
  return "";
};

export const validateRequired = (value, fieldName = "Field") => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
};

export const validatePositiveNumber = (value, fieldName = "Number") => {
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num <= 0) return `${fieldName} must be greater than zero`;
  return "";
};
