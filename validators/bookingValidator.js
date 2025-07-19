const { z } = require('zod');

// Booking form validation schema
const bookingSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
    
  email: z.string()
    .email('Please provide a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .trim(),
    
  message: z.string()
    .max(1000, 'Message must not exceed 1000 characters')
    .trim()
    .optional()
    .nullable()
    .transform(val => val || '') // Convert null/undefined to empty string
});

/**
 * Validates booking form data
 * @param {Object} data - Raw form data
 * @returns {Object} - Validated and sanitized data
 * @throws {z.ZodError} - If validation fails
 */
function validateBookingForm(data) {
  try {
    return bookingSchema.parse(data);
  } catch (error) {
    // Add custom error messages for better UX
    if (error instanceof z.ZodError) {
      const enhancedError = new z.ZodError(
        error.errors.map(err => ({
          ...err,
          message: getCustomErrorMessage(err)
        }))
      );
      throw enhancedError;
    }
    throw error;
  }
}

/**
 * Provides user-friendly error messages
 * @param {Object} error - Zod error object
 * @returns {string} - User-friendly error message
 */
function getCustomErrorMessage(error) {
  const { code, path, message } = error;
  const field = path[0];
  
  switch (field) {
    case 'name':
      if (code === 'too_small') return 'Please enter your full name (at least 2 characters)';
      if (code === 'too_big') return 'Name is too long (maximum 100 characters)';
      if (code === 'invalid_string') return 'Please enter a valid name using only letters, spaces, hyphens, and apostrophes';
      break;
      
    case 'email':
      if (code === 'invalid_string') return 'Please enter a valid email address (e.g., name@example.com)';
      if (code === 'too_big') return 'Email address is too long';
      break;
      
    case 'message':
      if (code === 'too_big') return 'Message is too long (maximum 1000 characters)';
      break;
  }
  
  return message; // Fallback to default message
}

/**
 * Validates just the email field (for partial validation)
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates just the name field (for partial validation)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
function isValidName(name) {
  try {
    bookingSchema.shape.name.parse(name);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateBookingForm,
  isValidEmail,
  isValidName,
  bookingSchema
}; 