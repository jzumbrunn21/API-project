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
  Sequelize,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Get all of the Current User's Bookings

router.get("/current", requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
        include: [{ model: SpotImage, attributes: ["url"] }],
      },
    ],
  });

  // Doing it manually. Can't figure out pojo manipulation way with this route (toJSON)
  // Will revisit for efficiency
  const response = bookings.map((booking) => {
    return {
      id: booking.id,
      spotId: booking.spotId,
      Spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.id,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.state,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price,
        previewImage: booking.Spot.SpotImages[0].url,
      },
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  });

  res.json({ Bookings: response });
});

router.put('/:bookingId', requireAuth, async (req, res)=> {
  const editedBooking = await Booking.findByPk(req.params.bookingId);
  if (!editedBooking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  if (editedBooking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const {startDate, endDate} = req.params
})

// Delete a Booking

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const deletedBooking = await Booking.findByPk(req.params.bookingId);

  if (!deletedBooking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (deletedBooking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  currentTimeObj = new Date();

  if (currentTimeObj >= deletedBooking.startDate) {
    res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await deletedBooking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
