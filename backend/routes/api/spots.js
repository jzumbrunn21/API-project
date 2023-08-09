const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// GET ALL SPOTS //
router.get("", async (req, res) => {
  const spots = await Spot.findAll();
  res.json({ Spots: spots });
});
module.exports = router;
