const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Referral } = require("../../db/models");
const referral = require("../../db/models/referral");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required."),
  handleValidationErrors,
];


//sign up
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, referralCode } = req.body;

  const existingEmailUser = await User.findOne({
    where: { email: email },
  });

  if (existingEmailUser) {
    return res.status(500).json({
      message: 'User already exists',
      errors: { email: 'User with that email already exists' },
    });
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    hashedPassword,
    firstName,
    lastName,
    phoneNumber,
    referralCode
  });

 // Check for a valid referral code and update credits

 if (referralCode) {
  const referrer = await User.findOne({ where: { referralCode } });

   if (referrer) {
     await Referral.create({
       referrerId: referrer.id,
       referredUserId: user.id,
       referralCode: referralCode,
       status: 'completed',
     });

     // Update credits for both the referrer and the new user
     await referrer.increment('credit', { by: 250 });
     console.log(user.credit)
     await user.increment('credit', { by: 250 });
     console.log(user.credit)
   } else {
     // Create a referral record with status 'invalid' if the code doesn't match
     await Referral.create({
       referrerId: null,
       referredUserId: user.id,
       referralCode: referralCode,
       status: 'invalid',
     });
   }
 }


  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    referralCode:user.referralCode,
    phoneNumber:user.phoneNumber,
    credit: user.credit,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});


// Update user profile route
router.put("/profile", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { email, phoneNumber, image, password,title  } = req.body;

  if (!email || !phoneNumber) {
    return res.status(400).json({ message: "Email and phone number cannot be null or empty" });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    user.phoneNumber = phoneNumber;
    user.title =title
    
    if (image) user.image = image;
    if (password) user.hashedPassword = bcrypt.hashSync(password);

    await user.save();

    const updatedUser = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      image: user.image,
      title:user.title,
      
    };

    return res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
