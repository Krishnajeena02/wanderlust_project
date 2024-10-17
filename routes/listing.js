const express = require("express");
const router = express.Router()
const wrapasync = require("../utils/wrapAsync.js")
const multer = require('multer');
const listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js")

const listingController = require("../controllers/listing.js")
const upload = multer({ dest: 'uploads/' })

router.route("/")
.get( wrapasync( listingController.index ))
// .post(isLoggedIn,validatelisting, wrapasync(listingController.createListing));

router.post("/", upload.single('listing[image]'), function (req, res, next) {
   // if (!req.file) {
   //    return res.status(400).send('No file uploaded.');
   //  }
    res.send(req.file);

 })
//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapasync(listingController.showListing))
.patch(isLoggedIn,isOwner, wrapasync(listingController.updateListing))
.delete(isLoggedIn,isOwner,  wrapasync( listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapasync(listingController.editListing));

module.exports = router;