// backend/routes/api/reviews.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
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
  
  YachtImage,
} = require("../../db/models");
let count = 0;

//Get all Reviews of the Current User (requireAuth)
// Returns all the reviews written by the current user.
router.get("/current", requireAuth, async (req, res, next) => {
  let currentUserId = req.user.id;
  if (currentUserId) {
    try {
      let getReview = await Review.findAll({
        where: { userId: currentUserId },
        include: [
          { model: Yacht, attributes: { exclude: ["createdAt", "updatedAt"] } },
          { model: User },
          {
            model: YachtImage,
          },
        ],
      });
      // res.json(getReview);
      if (getReview.length === 0) {
        return res.json({ Reviews: [] });
      }

      const resReviews = getReview.map((review) => {
        const yacht = review.Yacht;
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
          },
          Yacht: {
            id: yacht.id,
            ownerId: yacht.ownerId,
            address: yacht.address,
            city: yacht.city,
            state: yacht.state,
            country: yacht.country,
            lat: yacht.lat,
            lng: yacht.lng,
            name: yacht.name,
            price: yacht.price,
            previewImage: review.YachtImages[0].url,
          },
          s: review.s.map((image) => ({
            id: image.id,
            url: image.url,
          })),
        };
      });

      return res.json({ Reviews: resReviews });
    } catch (error) {
      return next(error);
    }
  }
});


// Edit a Review (Auth require)
router.put("/:reviewId",requireAuth, validateReview,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const curUserId = req.user.id;
    const { review, stars } = req.body;
    const reviewByPk = await Review.findByPk(reviewId);
    if (!reviewByPk) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }
    if (reviewByPk.userId !== curUserId) {
      return res.status(403).json({
        "message": "Forbidden"
      });
    }

    const editReview = await reviewByPk.update({
      review,
      stars,
    });
    const resReview = {
      id: editReview.id,
      userId: curUserId,
      yachtId: editReview.yachtId,
      review: editReview.review,
      stars: editReview.stars,
      createdAt: formatWithTime(editReview.createdAt),
      updatedAt: formatWithTime(editReview.updatedAt),
    };

    return res.status(200).json(resReview);
  },
  handleValidationErrors
);

//Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const curUserId = req.user.id;
  const reviewByPk = await Review.findByPk(reviewId);
  if (!reviewByPk) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (reviewByPk.userId !== curUserId) {
    return res.status(403).json({
      "message": "Forbidden"
    });
  }
  await reviewByPk.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});
module.exports = router;
