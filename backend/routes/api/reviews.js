const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const {
  Spot,
  User,
  SpotImage,
  Review,
  ReviewImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const deletedReview = await Review.findByPk(req.params.reviewId);

  if (!deletedReview) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (deletedReview.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deletedReview.destroy();
  return res.json({ message: "Successfully deleted" });
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    res.status(404).json({ message: "Review couldn't be found" });
  }
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId: review.id,
    },
  });

  imageList = [];

  reviewImages.forEach((image) => {
    imageList.push(image);
  });

  if (imageList.length > 10) {
    res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const { url } = req.body;

  const newImage = await ReviewImage.create({
    reviewId: review.id,
    url,
  });

  const response = {
    id: newImage.id,
    url: newImage.url,
  };

  res.json({ response });
});

// Edit a Review
router.put("/:reviewId", requireAuth, async (req, res) => {
  const reviews = await Review.findByPk(req.params.reviewId);
  if (!reviews) {
    res.status(404).json({ message: "Review couldn't be found" });
  }
  if (reviews.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { review, stars } = req.body;
  const error = {};
  if (!review) error.review = "Review text is required";
  if (!stars || stars < 0 || stars > 5)
    error.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(error).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors: error });
  }

  reviews.set({
    review,
    stars,
  });

  await reviews.save();
  res.json({ reviews });
});

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "email",
            "username",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: ReviewImage,
        attributes: {
          exclude: ["createdAt", "updatedAt", "reviewId"],
        },
      },
    ],
    where: {
      userId: req.user.id,
    },
  });
  const spots = await Spot.findAll({
    include: { model: SpotImage },
    where: {
      ownerId: req.user.id,
    },
    attributes: {
      exclude: ["description", "createdAt", "updatedAt"],
    },
  });

  let spotsList = [];

  spots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });

  // PREVIEW IMAGE
  spotsList.forEach((spot) => {
    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });

    if (!spot.previewImage) {
      spot.previewImage = "No image available";
    }
    delete spot.SpotImages;
  });

  res.json({ Reviews: reviews, Spot: spotsList, ReviewImages: ReviewImage });
});

module.exports = router;
