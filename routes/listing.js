const express = require("express");
const router = express.Router()
const wrapasync = require("../utils/wrapAsync.js")

const listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js")

const listingController = require("../controllers/listing.js")


router.route("/")
.get( wrapasync( listingController.index ))
.post(isLoggedIn,validatelisting, wrapasync( listingController.createListing)
   );
   


   ///new route
   router.get("/new",isLoggedIn, listingController.renderNewForm);

   router.route("/:id")
   .get(wrapasync( listingController.showListing))
   .patch(isLoggedIn,isOwner, wrapasync(listingController.updateListing))
   .delete(isLoggedIn,isOwner,  wrapasync( listingController.deleteListing));
   
   
   // show route
   
   
   //create route
   
       
   
   
   //edit route
   router.get("/:id/edit",isLoggedIn,isOwner, wrapasync(listingController.editListing));
   
   //update route
   router
   
   
   //delete ROUTE
   

   module.exports = router;
   