const express = require("express");
const router = express.Router({mergeParams:true})
const listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapAsync.js")
const review = require("../models/review.js");
const {validatereview, isLoggedIn} = require("../middleware.js")





router.post("/", isLoggedIn, validatereview, wrapasync(async (req,res)=>{

    let listings= await listing.findById(req.params.id);
    
    
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview)
      
// console.log(newreview)
listings.reviews.push(newreview);
await newreview.save();
await listings.save();
console.log("new review saved")
req.flash("success", "new review created")

res.redirect(`/listings/${listings._id}`)
   
}));

//delete route

router.delete("/:reviewId",  wrapasync(async (req,res)=>{
    let{id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted")

    res.redirect(`/listings/${id}`)
}))

module.exports = router;
