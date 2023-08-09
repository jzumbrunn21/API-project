const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Spot, User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// DELETE SPOT BY ID //
router.delete("/:spotId", requireAuth, async (req, res) => {
  const deletedSpot = await Spot.findByPk(req.params.spotId);

  if (deletedSpot && (this.owner === User.id)) {
    await deletedSpot.destroy();
    return res.json({
      message: "Successfully Deleted",
    });
  } else {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
});

// GET ALL SPOTS //
router.get("", async (req, res) => {
  const spots = await Spot.findAll();
  res.json({ Spots: spots });
});
module.exports = router;
