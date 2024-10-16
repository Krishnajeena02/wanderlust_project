const express = require("express");
const router = express.Router({mergeParams:true})
const listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapAsync.js")
const review = require("../models/review.js");
const {validatereview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")






router.post("/", isLoggedIn, validatereview, wrapasync(reviewController.CreateReview));

//delete route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapasync(reviewController.deleteReview))

module.exports = router;
