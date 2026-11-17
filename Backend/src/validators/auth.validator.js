import { body, validationResult } from "express-validator";

const validate = (validations, message) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message,
      errors: errors.array().map(({ path, msg }) => ({
        field: path,
        message: msg,
      })),
    });
  }

  next();
};

const registerValidations = [
  body("fullName")
    .isString()
    .withMessage("Full name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const registerValidation = validate(
  registerValidations,
  "Invalid registration details",
);

const loginValidations = [
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),
];

export const loginValidation = validate(
  loginValidations,
  "Invalid login details",
);

const resendVerificationValidations = [
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email address is required")
    .normalizeEmail(),
];

export const resendVerificationValidation = validate(
  resendVerificationValidations,
  "Enter a valid email address",
);
