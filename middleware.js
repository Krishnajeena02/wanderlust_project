// const e = require("connect-flash");
const listing = require("./models/listing")
const review = require("./models/review.js");

const{listingschema,reviewschema}= require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must be logged in to create or update the listings");
   return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl  
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params
    let listings  = await listing.findById(id)
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing")
  return  res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports. validatelisting= (req,res,next)=>{
    let {error}=  listingschema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg)
    }else{
        next();
    }
}


module.exports.validatereview= (req,res,next)=>{
    let {error}=  reviewschema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg)
    }else{
        next();
    }
}


module.exports.isReviewAuthor =async (req,res,next)=>{
    let {id, reviewId} = req.params
    let reviews  = await review.findById(reviewId);
    if(!reviews.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this review")
  return  res.redirect(`/listings/${id}`)
    }
    next()
}