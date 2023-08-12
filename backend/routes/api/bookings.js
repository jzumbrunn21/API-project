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

// Delete a Booking

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const deletedBooking = await Booking.findByPk(req.params.bookingId);

  if (!deletedBooking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (deletedBooking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // startDateString = deletedBooking.startDate.toDateString();
  // currentTimeObj = new Date();
  // // currentTimeString = currentTimeObj.toDateString();

  // if (currentTimeObj >= deletedBooking.startDate) {
  //   res.status(403).json({
  //     message: "Bookings that have been started can't be deleted",
  //   });
  // }

  await deletedBooking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
