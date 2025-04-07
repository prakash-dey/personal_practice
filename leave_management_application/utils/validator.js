import{body,validationResult} from 'express-validator';

export const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["employee", "manager","admin"])
    .withMessage("Invalid role specified"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
];

export const validateCourse = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("content")
    .isArray({ min: 1 })
    .withMessage("Course must have at least one content section"),
];

export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};