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
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// const { query } = require('express-validator/check');

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
    include: [{ model: SpotImage }, { model: Review }],
    where: {
      ownerId: req.user.id,
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

  // AVERAGE STARS
  spotsList.forEach((spot) => {
    let total = 0;
    spot.Reviews.forEach((review) => {
      total += review.stars;
    });

    const averageStars = total / spot.Reviews.length;
    spot.avgRating = averageStars;
    delete spot.Reviews;
  });

  res.json({ Spots: spotsList });
});

// Get all Bookings for a Spot based on the Spot's id

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (req.user.id === spot.ownerId) {
    const ownedBookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
      include: {
        model: User,
        attributes: {
          exclude: [
            "username",
            "email",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });

    res.json({ Bookings: ownedBookings });
  } else {
    const unownedBookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
      attributes: {
        exclude: ["id", "userId", "createdAt", "updatedAt"],
      },
    });

    res.json({ Bookings: unownedBookings });
  }
});

// Get all Reviews by a Spot's id

router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "email",
            "hashedPassword",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
    where: {
      spotId: spot.id,
    },
  });
  res.json({ Reviews: reviews });
});

// Get details of a Spot from an id

router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  // let jsonSpot = spot.toJSON();

  const spotImages = await SpotImage.findAll({
    where: {
      spotId: req.params.spotId,
    },
    attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
  });
  const owner = await User.findByPk(spot.ownerId, {
    attributes: { exclude: ["username"] },
  });

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
  });

  let total = 0;
  reviews.forEach((review) => {
    total += review.stars;
  });

  const avgStars = total / reviews.length;

  const response = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: reviews.length,
    avgStarRating: avgStars,
    SpotImages: spotImages.map((image) => ({
      id: image.id,
      url: image.url,
      preview: image.preview,
    })),
    Owner: {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
    },
  };

  res.json({ ...response });
});
// Query Params Handler

const validateSpotQueryParams = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .default(1)
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .default(20)
    .withMessage("Size must be greater than or equal to 1"),
  check("minLat")
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];
// GET ALL SPOTS //

router.get("/", validateSpotQueryParams, async (req, res, next) => {
  let { page, size } = req.query;

  if (
    !page ||
    isNaN(parseInt(page)) ||
    parseInt(page) < 1 ||
    parseInt(page) > 10
  ) {
    page = 1;
  }
  if (
    !size ||
    isNaN(parseInt(size)) ||
    parseInt(size) < 1 ||
    parseInt(size) > 20
  ) {
    size = 20;
  }

  size = parseInt(size);
  page = parseInt(page);

  const spots = await Spot.findAll({
    include: [{ model: SpotImage }, { model: Review }],
    offset: (page - 1) * size,
    limit: size,
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
  // AVERAGE STARS
  spotsList.forEach((spot) => {
    let total = 0;
    spot.Reviews.forEach((review) => {
      total += review.stars;
    });

    const averageStars = total / spot.Reviews.length;
    spot.avgRating = averageStars;
    delete spot.Reviews;
  });

  res.json({ Spots: spotsList, page, size });
});

// Add an Image to a Spot based on the Spot's id

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { url, preview } = req.body;

  const newImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  const response = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };

  res.status(200).json(response);
});

// Create a Review for a Spot based on the Spot's id

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  const { review, stars } = req.body;
  const error = {};
  if (!review) error.review = "Review text is required";
  if (!stars || stars < 0 || stars > 5)
    error.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(error).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors: error });
  }

  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
      spotId: req.params.spotId,
    },
  });

  let reviewsList = [];

  reviews.forEach((review) => {
    reviewsList.push(review);
  });

  if (reviewsList.length > 0) {
    return res
      .status(500)
      .json({ message: "User already has a review for this spot" });
  }

  const newReview = await Review.create({
    spotId: spot.id,
    userId: req.user.id,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

// Create and return a new booking from a spot specified by id.

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (req.user.id === spot.ownerId) {
    return res
      .status(403)
      .json({ message: "Forbidden: Spot cannot be booked by owner" });
  } else {
    const { startDate, endDate } = req.body;

    const dateError = {};

    if (!startDate) dateError.startDate = "startDate must exist";
    if (!endDate) dateError.endDate = "endDate must exist";
    if (endDate <= startDate)
      dateError.endDate = "endDate cannot be on or before startDate";

    if (Object.keys(dateError).length > 0) {
      return res
        .status(400)
        .json({ message: "Bad Request", errors: dateError });
    }

    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
    });

    let bookingConflict = {};

    let startTime = new Date(startDate).getTime();
    let endTime = new Date(endDate).getTime();
    for (let booking of bookings) {
      let bookedStartDate = new Date(booking.startDate);
      let bookedEndDate = new Date(booking.endDate);
      let bookedStartTime = bookedStartDate.getTime();
      let bookedEndTime = bookedEndDate.getTime();

      if (bookedStartTime >= startTime && bookedStartTime <= endTime) {
        bookingConflict.startDate =
          "Start date conflicts with an existing booking";
      }
      if (bookedEndTime >= startTime && bookedEndTime <= endTime) {
        bookingConflict.endDate = "End date conflicts with an existing booking";
      }
    }
    if (Object.keys(bookingConflict).length > 0) {
      return res.status(400).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: bookingConflict,
      });
    }
    const newBooking = await Booking.create({
      spotId: spot.id,
      userId: req.user.id,
      startDate,
      endDate,
    });

    res.json({ newBooking });
  }
});

// Edit a Spot
const validateEditSpot = [
  check("country")
    // .optional()
    .isLength({ min: 2 })
    .withMessage("Country must be longer than 2 characters")
    .isAlpha()
    .withMessage("Country cannot be a number"),
  check("address")
    // .optional()
    .isLength({ min: 6 })
    .withMessage("Address must be longer than 6 characters")
    .isAlpha()
    .withMessage("Address cannot be a number"),
  check("city")
    // .optional()
    .isAlpha()
    .withMessage("City cannot be a number")
    .isLength({ min: 2 })
    .withMessage("City must be longer than 2 characters"),
  check("state")
    // .optional()
    .isLength({ min: 2 })
    .withMessage("State must be longer than 2 characters")
    .isAlpha()
    .withMessage("State cannot be a number"),
  check("lat")
    // .optional()
    .isNumeric()
    .withMessage("Latitude must be a number"),
  check("lng")
    // .optional()
    .isNumeric()
    .withMessage("Longitude must be a number"),
  check("name")
    .isAlpha()
    .withMessage("Name cannot be a number")
    .isLength(2)
    .withMessage("Name must be longer than two characters"),
  check("description")
    // .optional()
    .isLength({ min: 30 })
    .withMessage("Description must be longer than 30 characters")
    .isAlpha()
    .withMessage("Description cannot be a number"),
  check("price")
    // .optional()
    .isDecimal({ min: 1 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];
router.put("/:spotId", requireAuth, validateEditSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat) errors.lat = "Latitude is not valid";
  if (!lng) errors.lng = "Longitude is not valid";
  if (!name || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price < 1) errors.price = "Price per day is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors: errors });
  }

  spot.set({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  await spot.save();
  // console.log("SPOT,", spot);
  res.json(spot);
});

// Create a Spot
const validateCreateSpot = [
  check("country")
    // .optional()
    .isLength({ min: 2 })
    .withMessage("Country must be longer than 2 characters")
    .isAlpha()
    .withMessage("Country cannot be a number"),
  check("address")
    // .optional()
    .isLength({ min: 6 })
    .withMessage("Address must be longer than 6 characters"),
    // .isAlphanumeric()
    // .withMessage("Address cannot be a number"),
  check("city")
    // .optional()
    .isAlpha()
    .withMessage("City cannot be a number")
    .isLength({ min: 2 })
    .withMessage("City must be longer than 2 characters"),
  check("state")
    // .optional()
    .isLength({ min: 2 })
    .withMessage("State must be longer than 2 characters")
    .isAlpha()
    .withMessage("State cannot be a number"),
  check("lat")
    // .optional()
    .isDecimal()
    .withMessage("Latitude must be a number"),
  check("lng")
    // .optional()
    .isDecimal()
    .withMessage("Longitude must be a number"),
  check("name")
    .isAlpha()
    .withMessage("Name cannot be a number")
    .isLength(2)
    .withMessage("Name must be longer than two characters"),
  check("description")
    // .optional()
    .isLength({ min: 30 })
    .withMessage("Description must be longer than 30 characters")
    .isAlpha()
    .withMessage("Description cannot be a number"),
  check("price")
    // .optional()
    .isDecimal({ min: 1 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  check("previewImage")
    // .optional()
    .matches(/\.(jpeg|jpg|png)$/)
    .withMessage("Preview Image must end in .jpg, .jpeg, or .png"),
  handleValidationErrors,
];

router.post("/", requireAuth, validateCreateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat) errors.lat = "Latitude is not valid";
  if (!lng) errors.lng = "Longitude is not valid";
  if (!name || name.length > 50)
    errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price < 1) errors.price = "Price per day is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors: errors });
  }

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});
module.exports = router;
