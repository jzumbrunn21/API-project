const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
} = require("../../utils/auth");
const { Spot, User, SpotImage, Review, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Get all of the Current User's Bookings

router.get("/current", requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const spots = await Spot.findAll({
    include: [{ model: SpotImage }, { model: User }],
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

  const user = await User.findAll({
    where: {
      id: req.user.id,
    },
  });
  res.json({ Bookings: bookings, Spot: spotsList, user });
});

// Delete a Booking

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const deletedBooking = await Booking.findByPk(req.params.bookingId);

  if (!deletedBooking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (deletedBooking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await deletedBooking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
