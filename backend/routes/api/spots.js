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

// DELETE SPOT BY ID //
router.delete("/:spotId", requireAuth, async (req, res) => {
  const deletedSpot = await Spot.findByPk(req.params.spotId);

  if (!deletedSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (deletedSpot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deletedSpot.destroy();
  return res.json({ message: "Successfully deleted" });
});

// GET ALL SPOTS BY CURRENT USER

router.get("/current", requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: SpotImage }, { model: Review }],
    where: {
      ownerId: req.user.id,
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

  // AVERAGE STARS
  spotsList.forEach((spot) => {
    let total = 0;
    spot.Reviews.forEach((review) => {
      total += review.stars;
    });

    const averageStars = total / spot.Reviews.length;
    spot.avgRating = averageStars;
    delete spot.Reviews;
  });

  res.json({ Spots: spotsList });
});




























// Get all Reviews by a Spot's id

router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "email",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
    where: {
      spotId: spot.id,
    },
  });
  res.json({ Reviews: reviews });
});

// Get details of a Spot from an id

router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  let jsonSpot = spot.toJSON();

  const images = await SpotImage.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
  });
  const owner = await User.findAll({
    where: {
      id: spot.ownerId,
    },
    attributes: { exclude: ["username"] },
  });

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
  });

  let reviewsList = [];

  reviews.forEach((review) => {
    reviewsList.push(review.toJSON());
  });

  reviewsList.forEach((review) => {
    let total = 0;
    total += review.stars;
    const averageStars = total / reviewsList.length;
    jsonSpot.avgStarRating = averageStars;
    delete jsonSpot.Reviews;
  });

  jsonSpot.numReview = reviewsList.length;

  res.json({ Spot: jsonSpot, SpotImages: images, Owner: owner });
});
// GET ALL SPOTS //

router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: SpotImage }, { model: Review }],
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
  // AVERAGE STARS
  spotsList.forEach((spot) => {
    let total = 0;
    spot.Reviews.forEach((review) => {
      total += review.stars;
    });

    const averageStars = total / spot.Reviews.length;
    spot.avgRating = averageStars;
    delete spot.Reviews;
  });

  res.json({ Spots: spotsList });
});
module.exports = router;
