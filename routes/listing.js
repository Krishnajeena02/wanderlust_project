const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

console.log("Type of isLoggedIn:", typeof isLoggedIn); // for debugging

router.route("/")
  .get(wrapasync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
    wrapasync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/:category", listingController.filterByCategory);

router.route("/:id")
  .get(wrapasync(listingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapasync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapasync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(listingController.editListing));

module.exports = router;