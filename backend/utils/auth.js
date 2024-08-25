// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

const requireAuth = function (req, res, next) {
  if (req.user) return next();

  return res.status(401).json({ message: 'Authentication required' });
};
const formatDate = function (date) {
  return date.toISOString().split("T")[0];
};
const formatWithTime = function (date) {
  const dateToStringIso = new Date(date).toISOString();
  const formattedDate = dateToStringIso.split("T")[0];
  const formattedTime = dateToStringIso.split("T")[1].split(".")[0];
  return `${formattedDate} ${formattedTime}`;
};
const formatWithTimeLocal = function (date) {
  const localDate = new Date(date);
  
  // Get the formatted date and time in the local timezone
  const formattedDate = localDate.toLocaleDateString(); 
  const formattedTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  formatDate,
  formatWithTime,
  formatWithTimeLocal
};
