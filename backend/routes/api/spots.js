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
    where: {
      ownerId: req.user.id,
    },
    include: {
      model: SpotImage,
      attributes: ["preview"],
    },
    include: {
      model: Review,
      attributes: ["stars"],
    },
  });
  res.json({ Spots: spots });
});

// GET ALL SPOTS //
router.get("", async (req, res) => {
  const spots = await Spot.findAll();
  res.json({ Spots: spots });
});
module.exports = router;
