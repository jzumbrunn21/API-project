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
  Booking,
  ReviewImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const deletedImage = await ReviewImage.findByPk(req.params.imageId);
  if (!deletedImage) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }
  
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const review = await Review.findByPk(deletedImage.reviewId);

  if (user.id !== review.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deletedImage.destroy();
  return res.json({ message: "Successfully deleted" });
});
module.exports = router;
