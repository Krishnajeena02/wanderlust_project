const listing = require("../models/listing.js");


module.exports.index=async (req,res)=>{
    const alllistings = await listing.find({})
    res.render("listings/index.ejs",{alllistings});
}

module.exports.renderNewForm =(req,res)=>{
  res.render("listings/new.ejs");
}


module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listings= await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error", "listing does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listings});
}

module.exports.createListing = async(req,res,next) => {
      
    // console.log("create listing body:",req.body) 
           
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "new listing created")
    res.redirect("/listings");
}


module.exports.editListing=async (req,res)=>{
    let {id} = req.params;
    const listings= await listing.findById(id);
    if(!listings){
        req.flash("error", "listing does not exist");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listings});
}

module.exports.updateListing= async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{ ...req.body.listing});
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async (req,res)=>{
    let {id} = req.params;
    let deleted =  await listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted")
    
    res.redirect("/listings");
    console.log(deleted);
}