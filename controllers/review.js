const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.CreateReview=async (req,res)=>{

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
   
}

module.exports.deleteReview=async (req,res)=>{
    let{id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted")

    res.redirect(`/listings/${id}`)
}