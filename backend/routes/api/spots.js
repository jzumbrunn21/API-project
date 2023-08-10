const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Spot, User, SpotImage, Review } = require("../../db/models");
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
