
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  requireAuth,
  formatDate,
  formatWithTime,
} = require("../../utils/auth");
const {
  Yacht,
  User,
  Review,
  ReviewImage,
  YachtImage,
  Booking,
} = require("../../db/models");

const handleValidateQuery = [
  (req, res, next) => {
    // If page is not provided, set it to the default value of 10
    if (!req.query.page) {
      req.query.page = 1;
    }

    if (!req.query.size) {
      req.query.size = 20;
    }
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && req.query[key] === "") {
        delete req.query[key];
      }
    }
    next();
  },
  query("page")
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1")
    .optional(),
  query("page")
    .isInt({ max: 10 })
    .withMessage("Page must be less than or equal to 10")
    .optional(),
  query("size")
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1")
    .optional(),
  query("size")
    .isInt({ max: 20 })
    .withMessage("Size must be less than or equal to 20")
    .optional(),

  query("minPrice")
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0")
    .bail()
    .custom(async (min, { req }) => {
      const max = req.query.maxPrice;
      if (Number.parseFloat(min) > Number.parseFloat(max)) {
        throw new Error("Minimum price cannot be greater than maximum price");
      }
    })
    .optional(),
  query("maxPrice")
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0")
    .bail()
    .custom(async (max, { req }) => {
      const min = req.query.minPrice;
      if (Number.parseFloat(max) < Number.parseFloat(min)) {
        throw new Error("Maximum price cannot be less than minimum price");
      }
    })
    .optional(),
  handleValidationErrors,
];

// Get all yachts
router.get("/", handleValidateQuery, async (req, res) => {
  let { page = 1, size = 20 } = req.query;
  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;
  page = parseInt(page) || 1;
  size = parseInt(size) || 20;

  let limit = size;
  let offset = size * (page - 1);

  const options = {
    include: [
      { model: YachtImage, where: { preview: true }, required: false },
    ],
    where: {},
    limit,
    offset,
  };

 
  if (minPrice) {
    options.where.price = { [Op.gte]: minPrice };
  }
  if (maxPrice) {
    options.where.price = { [Op.lte]: maxPrice };
  }
  let allYachts = await Yacht.findAll(options);
  console.log('line112', allYachts)
  allYachts = allYachts.map((yacht) => {
    // const reviews = yacht.Reviews;
    // const numReviews = reviews?.length;
    // let sum = 0;
    // reviews.forEach((review) => {
    //   sum += review.stars;
    // });
    // const avgRating = Math.round((sum / numReviews) * 10) / 10;
    // yacht.dataValues.avgRating = avgRating;
    // delete yacht.dataValues.Reviews;

    yacht.dataValues.previewImage = "";
    if (yacht.dataValues.YachtImages) {
      const foundYachtImage = yacht.dataValues.YachtImages.find((image) => {
        return image.preview;
      });
      if (foundYachtImage) {
        yacht.dataValues.previewImage = foundYachtImage.url;
      }else {
        yacht.dataValues.previewImage = null; 
    }
    }
    yacht.dataValues.createdAt = formatWithTime(yacht.dataValues.createdAt);
    yacht.dataValues.updatedAt = formatWithTime(yacht.dataValues.updatedAt);

    delete yacht.dataValues.YachtImages;
    return yacht;
  });
  const resObj = { Yachts: allYachts, page, size };
  return res.status(200).json(resObj);
});



//Get all Yachts owned by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const allYachts = await Yacht.findAll({
    where: { ownerId: curUserId },
    include: [
      {
        model: YachtImage,
      },
      {
        model: Review,
      },
    ],
  });

  if (!allYachts && curUserId !== allYachts[0].ownerId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  const getYachtsRes = allYachts.map((yacht) => {
    let totalStars = 0;
    let avgRating = null;

    if (yacht.Reviews && yacht.Reviews.length > 0) {
      yacht.Reviews.forEach((review) => {
        totalStars += review.stars;
      });

      avgRating = totalStars / yacht.Reviews.length;
    }
    const previewImage =
      yacht.YachtImages.length > 0 ? yacht.YachtImages[0].url : null;
    return {
      id: yacht.id,
      ownerId: yacht.ownerId,
      address: yacht.address,
      city: yacht.city,
      state: yacht.state,
      country: yacht.country,
      lat: yacht.lat,
      lng: yacht.lng,
      name: yacht.name,
      description: yacht.description,
      price: yacht.price,
      createdAt: formatWithTime(yacht.createdAt),
      updatedAt: formatWithTime(yacht.updatedAt),
      avgRating: avgRating,
      previewImage: previewImage,
    };
  });

  return res.json({ Yachts: getYachtsRes });
});

// Delete a Yacht
router.delete("/:yachtId", requireAuth, async (req, res, next) => {
  const { yachtId } = req.params;
  const curUserId = req.user.id;
  const deletedYacht = await Yacht.findByPk(yachtId);
  if (!deletedYacht) {
    res.status(404).json("Yacht couldn't be found");
  }
  if (deletedYacht && deletedYacht.ownerId === curUserId) {
    await deletedYacht.destroy();
    return res.json("Successfully deleted");
  }
  res.status(403).json({
    message: "Forbidden",
  });
});

// Get details of a Yacht from an id
router.get("/:yachtId", async (req, res, next) => {
  const { yachtId } = req.params;
  const allYachts = await Yacht.findAll({
    where: { id: yachtId },
    include: [
      {
        model: YachtImage,
        attributes: { exclude: ["createdAt", "updatedAt", "yachtId"] },
      },
      {
        model: Review,
         attributes: { exclude: ["createdAt", "yachtId"  , "id"] },
      },
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "createdAt",
            "updatedAt",
            "email",
            "hashedPassword",
          ],
        },
      },
    ],
  });
  
  // Check if Yacht exists
  if (allYachts.length === 0) {
    return res.status(404).json({ message: "Yacht couldn't be found" });
  }
  // res.json(allYachts);
  const getYachtsRes = allYachts.map((yacht) => {
    let totalStars = 0;
    let avgRating = null;
   
    if (yacht.Reviews && yacht.Reviews.length > 0) {
      yacht.Reviews.forEach((review) => {
        totalStars += review.stars;
      });
      avgRating = totalStars / yacht.Reviews.length;
      avgRating = Math.round(avgRating * 10) / 10;
    }

    return {
      id: yacht.id,
      ownerId: yacht.ownerId,
      address: yacht.address,
      city: yacht.city,
      state: yacht.state,
      country: yacht.country,
      lat: yacht.lat,
      lng: yacht.lng,
      name: yacht.name,
      description: yacht.description,
      price4: yacht.price4,
      price6: yacht.price6,
      price8: yacht.price8,
      length:yacht.length,
      year:yacht.year,
      builder:yacht.builder,
      guests:yacht.guests,
      cabins:yacht.cabins,
      speed:yacht.speed,
      bathrooms:yacht.bathrooms,
      createdAt: formatWithTime(yacht.createdAt),
      updatedAt: formatWithTime(yacht.updatedAt),
      numReviews: yacht.Reviews.length || null,
      avgStarRating: avgRating,
      YachtImages: yacht.YachtImages.length > 0 ? yacht.YachtImages : null,
      Owner: yacht.User,
      // Reviews: yacht.Reviews
    };
  });

  return res.json(getYachtsRes);
});

const validateYachtBody = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  check("lng")
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  check("name")
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

//Edit a Yacht
//Updates and returns an existing yacht.
router.put(
  "/:yachtId",
  requireAuth,
  validateYachtBody,
  async (req, res, next) => {
    const { yachtId } = req.params;
    const curUserId = req.user.id;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const yacht = await Yacht.findByPk(yachtId);
    if (!yacht) {
      return res.status(404).json({
        message: "Yacht couldn't be found",
      });
    }
    if (yacht.ownerId !== curUserId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const editYacht = await yacht.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    let resYacht = {
      id: yacht.id,
      ownerId: yacht.ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt: formatWithTime(editYacht.createdAt),
      updateAt: currentTime,
    };

    return res.status(200).json(resYacht);
  }
);

//Create a Yacht (require Auth)
router.post("/", requireAuth, validateYachtBody, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newYacht = await Yacht.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const resYacht = {
    id: newYacht.id,
    ownerId: newYacht.ownerId,
    address: newYacht.address,
    city: newYacht.city,
    state: newYacht.state,
    country: newYacht.country,
    lat: newYacht.lat,
    lng: newYacht.lng,
    name: newYacht.name,
    description: newYacht.description,
    price: newYacht.price,
    createdAt: formatWithTime(newYacht.createdAt),
    updatedAt: formatWithTime(newYacht.updatedAt),
  };

  return res.status(201).json(resYacht);
});

//Add an Image to a Yacht based on the Yacht's id (Auth require)

router.post("/:yachtId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const { yachtId } = req.params;
  const curUserId = req.user.id;
  const yacht = await Yacht.findByPk(yachtId);
  if (!yacht) {
    res.status(404).json({
      message: "Yacht couldn't be found",
    });
  }
  if (curUserId === yacht.ownerId) {
    const newImage = await YachtImage.create({
      url: url,
      preview: preview,
      yachtId: yachtId,
    });
    const resImage = {
      id: newImage.id,
      url,
      preview,
    };

    return res.json(resImage);
  }
  return res.status(403).json({ message: "Forbidden" });
});
//Get All images of the Yacht's id

router.get("/:yachtId/images",  async (req, res, next) => {

  const { yachtId } = req.params;
  
  const yacht = await YachtImage.findAll({
    where: { yachtId: yachtId }});
  if (!yacht) {
    res.status(404).json({
      message: "Yacht couldn't be found",
    });
  }


  return res.json(yacht);
});

// Get all Reviews by a Yacht's id
// Returns all the reviews that belong to a yacht specified by id.
router.get("/:yachtId/reviews", async (req, res, next) => {
  const { yachtId } = req.params;
  const yacht = await Yacht.findByPk(yachtId);
  if (!yacht) {
      return res.status(404).json({ message: "Yacht couldn't be found" });
  }
  let yachtReview = await Review.findAll({
    where: {
      yachtId: yachtId,
      
    },order: [['updatedAt', 'DESC'], [['createdAt', 'DESC']]],
    include: [
      {
        model: User,
      },

    
    ],
  });
 

  
  const resReviews = yachtReview.map((review) => {
    return {
      id: review.id,
      userId: review.userId,
      yachtId: review.yachtId,
      review: review.review,
      stars: review.stars,
      createdAt: formatWithTime(review.createdAt),
      updatedAt: formatWithTime(review.updatedAt),
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName,
        image: review.User.image
      },

     
    };
  });
  return res.json({ Reviews: resReviews });
});

validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//Create a Review for a Yacht based on the Yacht's id
router.post(
  "/:yachtId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const curUserId = req.user.id;
    const { review, stars } = req.body;
    const { yachtId } = req.params;

    //Check if the Yacht exists
    const findYacht = await Yacht.findByPk(yachtId);
  
    if (!findYacht) {
      return res.status(404).json({
        message: "Yacht couldn't be found",
      });
    }
    const existingReview = await Review.findOne({
      where: {
        userId: curUserId,
        yachtId: yachtId,
      },
    });
    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this yacht",
      });
    }
    const newReview = await Review.create({
      userId: curUserId,
      yachtId: Number(yachtId),
      review: review,
      stars: stars,
    });
    const resReview = {
      id: newReview.id,
      userId: curUserId,
      yachtId: Number(yachtId),
      review: review,
      stars: stars,
      createdAt: formatWithTime(newReview.createdAt),
      updatedAt: formatWithTime(newReview.updatedAt),
    };

    return res.status(201).json(resReview);
  },
  handleValidationErrors
);

const validateBooking = [
  check("startDateTime")
    .exists({ checkFalsy: true })
    .withMessage("startDateTime is required")
    .isISO8601()
    .withMessage("startDateTime must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDateTime cannot be in the past");
      }
      return true;
    }),
  check("endDateTime")
    .exists({ checkFalsy: true })
    .withMessage("endDateTime is required")
    .isISO8601()
    .withMessage("endDateTime must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDateTime)) {
        throw new Error("endDateTime cannot be on or before start date");
      }
      return true;
    }),
  handleValidationErrors,
];


//Create a Booking from a Yacht based on the Yacht's id

router.post(
  "/:yachtId/bookings",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const curUserId = req.user.id;
    const { startDateTime, endDateTime, totalPrice , duration, guests} = req.body;
    const { yachtId } = req.params;

    // Retrieve yacht information along with associated bookings
    const yachtByPk = await Yacht.findByPk(yachtId, {
      include: [Booking],
    });

    if (!yachtByPk) {
      return res.status(404).json({
        message: "Yacht couldn't be found",
      });
    }

    // Check if the yacht belongs to the current user
    if (curUserId === yachtByPk.ownerId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const arrBookings = yachtByPk.dataValues.Bookings || [];
    // let hasConflict = false;
    // const conflicts = {};

    // for (let booking of arrBookings) {
    //   const bs = new Date(booking.startDateTime).getTime();
    //   const be = new Date(booking.endDateTime).getTime();
    //   const s = new Date(startDateTime).getTime();
    //   const e = new Date(endDateTime).getTime();

    //   // Check for overlap between the existing booking and the new booking
    //   if ((s <= be && e > bs) || (bs <= e && be > s)) {
    //     hasConflict = true;
    //     if ((s >= bs && s <= be) || (s < bs && e > be)) {
       
    //       conflicts.startDateTime = "Start date conflicts with an existing booking";
    //     }
    //     if ((e >= bs && e <= be) || (e > be && s < bs)) {
    //       conflicts.endDateTime = "End date conflicts with an existing booking";
    //     }
    //   }
    // }

    // if (hasConflict) {
    //   return res.status(403).json({
    //     message: "Sorry, this yacht is already booked for the specified dates",
    //     errors: conflicts,
    //   });
    // }



    // Create new booking
    const newBooking = await Booking.create({
      yachtId: yachtId,
      userId: curUserId,
      totalPrice: totalPrice,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      duration,
      guests,
    });
    const resBooking = {
      id: newBooking.id,
      yachtId: Number(newBooking.yachtId),
      userId: newBooking.userId,
      totalPrice: newBooking.totalPrice,
      startDateTime: formatWithTime(newBooking.startDateTime),
      endDateTime: formatWithTime(newBooking.endDateTime),
      duration: newBooking.duration,
      guests: newBooking.guests,
      createdAt: formatWithTime(newBooking.createdAt),
      updatedAt: formatWithTime(newBooking.updatedAt),
    };
    return res.status(200).json(resBooking);
  }
);

//  all Bookings for a Yacht based on the Yacht's id (Auth require)
router.get("/:yachtId/bookings", requireAuth, async (req, res, next) => {
  const curUserId = req.user.id;
  const { yachtId } = req.params;

  const allYachts = await Yacht.findAll({
    where: { id: yachtId },
    attributes: {
      exclude: [
        "city",
        "id",
        "address",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
      ],
    },
    include: [{ model: Booking, include: [User] }],
  });
  // res.json(allYachts[0]);
  if (!allYachts.length) {
    res.status(404).json({
      message: "Yacht couldn't be found",
    });
  }
  //if you are owner of the yacht
  if (curUserId === allYachts[0].ownerId) {
    const ownerBookings = allYachts[0].Bookings.map((booking) => ({
      User: booking.User,
      id: booking.id,
      yachtId: yachtId,
      userId: booking.userId,
      startDateTime: formatDate(booking.startDateTime),
      endDateTime: formatDate(booking.endDateTime),
      createdAt: formatWithTime(booking.createdAt),
      updatedAt: formatWithTime(booking.updatedAt),
    }));
    return res.json({ Bookings: ownerBookings });
  }

  //if you are not owner of the Yacht
  const notOwnerBookings = allYachts[0].Bookings.map((booking) => ({
    yachtId: booking.yachtId,
    startDateTime: formatDate(booking.startDateTime),
    endDateTime: formatDate(booking.endDateTime),
    id: booking.id
  }));

  return res.json({ Bookings: notOwnerBookings });
});

module.exports = router;
