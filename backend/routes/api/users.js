const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email."),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required.")
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required."),
  handleValidationErrors,
];

router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  const existingEmailUser = await User.findOne({
    where: { email: email },
  });

  if (existingEmailUser) {
    return res.status(500).json({
      message: 'User already exists',
      errors: { email: 'User with that email already exists' },
    });
  }

  const existingUsernameUser = await User.findOne({
    where: { username: username },
  });

  if (existingUsernameUser) {
    return res.status(500).json({
      message: 'User already exists',
      errors: { username: 'User with that username already exists' },
    });
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
