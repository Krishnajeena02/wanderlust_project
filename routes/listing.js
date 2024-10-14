const express = require("express");
const router = express.Router()
const wrapasync = require("../utils/wrapAsync.js")

const listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js")




//index route
router.get("/", wrapasync( async (req,res)=>{
    const alllistings =   await listing.find({})
           res.render("listings/index.ejs",{alllistings});
       
   
   }));
   
   ///new route
   router.get("/new",isLoggedIn,(req,res)=>{
  
       res.render("listings/new.ejs");
   });
   
   // show route
   router.get("/:id",wrapasync( async (req,res)=>{
   let {id} = req.params;
    const listings= await listing.findById(id).populate("reviews").populate("owner");
   if(!listings){

    req.flash("error", "listing does not exist");
    res.redirect("/listings")
   }

   console.log(listings)
    res.render("listings/show.ejs",{listings})
   
   }));
   
   //create route
   router.post("/",validatelisting, wrapasync(async(req,res,next)=>{
      
    //   console.log(req.body) 
       
           const newlisting= new listing(req.body.listing);
           newlisting.owner= req.user._id;
           await newlisting.save();
       req.flash("success", "new listing created")
       res.redirect("/listings");
       } )
   );
   
       
   
   
   //edit route
   router.get("/:id/edit",isLoggedIn,isOwner, wrapasync(async (req,res)=>{
       let {id} = req.params;
    const listings= await listing.findById(id);
    if(!listings){
        req.flash("error", "listing does not exist");
        res.redirect("/listings")
       }
       res.render("listings/edit.ejs",{listings});
   }));
   
   //update route
   router.patch("/:id",isLoggedIn,isOwner, wrapasync( async (req,res)=>{
     
       let {id} = req.params;
    

   await listing.findByIdAndUpdate(id,{ ...req.body.listing});
   req.flash("success", "listing updated")
   
   res.redirect(`/listings/${id}`);
   }));
   
   
   //delete ROUTE
   router.delete("/:id",isLoggedIn,isOwner,  wrapasync( async (req,res)=>{
       let {id} = req.params;
       let deleted =  await listing.findByIdAndDelete(id);
       req.flash("success", " listing deleted")
      
       res.redirect("/listings");
       console.log(deleted);
   }));

   module.exports = router;
   