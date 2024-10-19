const express = require("express");
const router = express.Router()
const wrapasync = require("../utils/wrapAsync.js")
const listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js")

const listingController = require("../controllers/listing.js")
const multer = require('multer');
const {storage}= require("../cloudConfig.js")
const upload=multer({storage})


router.route("/")
.get( wrapasync( listingController.index ))
.post(
   isLoggedIn,
   upload.single("listing[image]"),
   validatelisting,
   wrapasync(listingController.createListing)
);
//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapasync(listingController.showListing))
.patch(isLoggedIn,
   isOwner,
   validatelisting, 
   upload.single("listing[image]"),
   wrapasync(listingController.updateListing))
.delete(isLoggedIn,isOwner,  wrapasync( listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapasync(listingController.editListing));

module.exports = router;