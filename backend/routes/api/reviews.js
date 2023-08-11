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
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
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

  res.json({ Reviews: reviews, Spot: Spot, ReviewImages: ReviewImage });
});

module.exports = router;
