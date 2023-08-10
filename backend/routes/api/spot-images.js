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

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const deletedImage = await SpotImage.findByPk(req.params.imageId);
  if (!deletedImage) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const spot = await Spot.findByPk(deletedImage.spotId);

  if (user.id !== spot.ownerId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deletedImage.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
