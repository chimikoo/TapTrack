import { body, validationResult } from "express-validator";

const userValidationRules = () => {
  return [
    body("username")
      .exists()
      .withMessage("Username is required")
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isString()
      .withMessage("Username should be a string")
      .escape()
      .trim()
      .toLowerCase(),
    body("password")
      .exists()
      .withMessage("Password is required")
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isString()
      .withMessage("Password should be a string")
      .isLength({ min: 6, max: 15 })
      .withMessage("Password should be between 6 to 15 characters")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,15}$/)
      .withMessage(
        "Password should contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .trim()
      .escape(),
    body("name")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isString()
      .withMessage("Name should be a string")
      .escape()
      .trim(),
    body("email")
      .exists()
      .withMessage("Email is required")
      .notEmpty()
      .withMessage("Email cannot be empty")
      .trim()
      .isEmail()
      .withMessage("You have to enter a valid email address")
      .normalizeEmail()
      .escape(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = [];
  errors.errors.map((err) => errorMessages.push({ [err.path]: err.msg }));
  return res.status(400).json({
    errors: errorMessages,
  });
};

export { userValidationRules, validate };
