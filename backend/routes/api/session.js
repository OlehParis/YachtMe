// backend/routes/api/session.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
  
    firstName: user.firstName,
    lastName: user.lastName,
  };
  console.log(safeUser);
  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});
// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

// Restore session user
router.get("/",  async (req, res) => {
  const { user } = req;
  if(user)
{const user1 = await User.unscoped().findOne({
  where: {
    id: req.user.id,
  },
  exclude: ["hashedPassword", "createdAt", "updatedAt"],
});

  if (user1) {
    const safeUser = {
      id: user1.id,
      email: user1.email,
      firstName: user1.firstName,
      lastName: user1.lastName,
      username: user1.username,
    };
    return res.json({
      user: safeUser,
    });}
  } else return res.json({ user: null });
});

module.exports = router;
