// backend/routes/api/review-images.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { Op } = require("sequelize");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth, formatDate, formatWithTime } = require("../../utils/auth");
const {
  Yacht,
  User,
  YachtImage,
  Booking,
} = require("../../db/models");

//Get all of the Current User's Bookings (Auth require)
router.get("/current", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const curBookings = await Booking.findAll({
    where: { userId: curUserId },
    include: [
      {
        model: Yacht,
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
        include: [
          {
            model: YachtImage,
            attributes: ["url"],
          },
        ],
      },
    ],
  });
  const resBookings = curBookings.map((booking) => {
    const previewImage = booking.Yacht.YachtImages.length > 0 ? booking.Yacht.YachtImages[0].url : null;
    return {
      
      id: booking.id,
      yachtId: booking.Yacht.id,
      totalPrice: booking.totalPrice,
      Yacht: {
        id: booking.Yacht.id,
        ownerId: booking.Yacht.ownerId,
        address: booking.Yacht.address,
        city: booking.Yacht.city,
        state: booking.Yacht.state,
        country: booking.Yacht.country,
        lat: booking.Yacht.lat,
        lng: booking.Yacht.lng,
        name: booking.Yacht.name,
        price: booking.Yacht.price,
        previewImage: previewImage,
      },
      userId: booking.userId,
      startDate: formatDate(booking.startDate),
      endDate: formatDate(booking.endDate),
      createdAt: formatWithTime(booking.createdAt),
      updatedAt: formatWithTime(booking.updatedAt),
    };
  });
  res.json({ Bookings: resBookings });
});

//Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const { bookingId } = req.params;
  const allBooking = await Booking.findAll({
    where: { id: bookingId },
    include: [Yacht, User],
  });
  if (allBooking.length === 0 || !allBooking[0]) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }
  if (curUserId !== allBooking[0].userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const bs = allBooking[0].startDate.getTime();
  const be = allBooking[0].endDate.getTime();
  const curTime = new Date().getTime();
  //  console.log(curTime > bs && curTime < be)
  if (curTime > bs && curTime < be) {
    res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  //   Booking must belong to the current user
  if (curUserId === allBooking[0].userId) {
    await allBooking[0].destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }

  //Yacht must belong to the current user

  if (allBooking[0].Yacht && curUserId === allBooking[0].Yacht.ownerId) {
    await allBooking[0].destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});
const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .isISO8601()
    .withMessage("startDate must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .isISO8601()
    .withMessage("endDate must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("endDate cannot be on or before start date");
      }
      return true;
    }),
  handleValidationErrors,
];

//Edit booking (Auth require)

router.put(
  "/:bookingId",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const curUserId = req.user.id;
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;
    const bookingById = await Booking.findAll({
      where: { id: bookingId },
    });
    if (bookingById.length === 0 || !bookingById) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }
    if (curUserId !== bookingById[0].userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const bs = new Date(bookingById[0].startDate).getTime();
    const be = new Date(bookingById[0].endDate).getTime();
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    const curTime = new Date().getTime();

    if (curTime > be) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    // Check for overlap between the existing booking and the new booking
    const otherBookings = await Booking.findAll({
      where: {
        id: {
          [Op.ne]: bookingId,
        },
        yachtId: bookingById[0].yachtId,
      },
    });

    let conflicts = {};
    let hasConflict = false;

    for (let booking of otherBookings) {
      const oS = new Date(booking.startDate).getTime();
      const oE = new Date(booking.endDate).getTime();

      if ((s <= oE && e > oS) || (oS <= e && oE > s)) {
        hasConflict = true;
        if ((s >= oS && s <= oE) || (s < oS && e > oE)) {
          conflicts.startDate = "Start date conflicts with an existing booking";
        }
        if ((e >= oS && e <= oE) || (e > oE && s < oS)) {
          conflicts.endDate = "End date conflicts with an existing booking";
        }
      }
    }

    if (hasConflict) {
      return res.status(403).json({
        message: "Sorry, this Yacht is already booked for the specified dates",
        errors: conflicts,
      });
    }
    if (curUserId === bookingById[0].userId) {
      const editBooking = await bookingById[0].update({
        startDate: startDate,
        endDate: endDate,
        createdAt: bookingById[0].createdAt,
        updatedAt: bookingById[0].updatedAt,
      });
      const resBooking = {
        id: editBooking.id,
        yachtId: editBooking.yachtId,
        userId: editBooking.userId,
        startDate: formatDate(editBooking.startDate),
        endDate: formatDate(editBooking.endDate),
        createdAt: formatWithTime(editBooking.createdAt),
        updatedAt: formatWithTime(editBooking.updatedAt),
      };
      return res.status(200).json(resBooking);
    }
  },

  handleValidationErrors
);

module.exports = router;
