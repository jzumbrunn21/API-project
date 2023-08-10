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

module.exports = router;
