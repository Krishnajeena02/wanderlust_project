const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const listing = require("../models/listing.js");
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const alllistings = await listing.find({})
  res.render("listings/index.ejs", { alllistings, page: "index" });
}

module.exports.renderNewForm =(req,res)=>{
  res.render("listings/new.ejs");
}
module.exports.filterByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const listings = await listing.find({ category });
        if (!listings || listings.length === 0) {
            req.flash("error", `No listings found in category: ${category}`);
            return res.redirect("/listings");
        }
        res.render("listings", { alllistings: listings });  //here i removed slash
    } catch (e) {
        console.error("Error while filtering by category:", e);
        res.status(500).send("Server Error");
        res.redirect("/listings");

    }
};



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

  let response= await  geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1,
      })
        .send();
        // res.send(coordinates);
        
    
           
    const newlisting = new listing(req.body.listing);
    newlisting.image = {url: req.file.path, filename: req.file.filename};
    newlisting.owner = req.user._id;
    newlisting.geometry=response.body.features[0].geometry;
  let save=  await newlisting.save();
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
  let  originalImage=listings.image.url;
 originalImage=originalImage.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listings,originalImage});
}

module.exports.updateListing= async (req,res)=>{
  let response= await  geocodingClient.forwardGeocode({
    query:req.body.listing.location,
    limit: 1,
  })
    .send();
    let {id} = req.params;
 
    let Listing=  await listing.findByIdAndUpdate(id,{ ...req.body.listing});
  
    if(typeof req.file !=="undefined"){
    Listing.image=  {url: req.file.path, filename: req.file.filename};
    Listing.geometry=response.body.features[0].geometry;

    await Listing.save();
  }
    
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async (req,res)=>{
    let {id} = req.params;
    let deleted =  await listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted")
    
    res.redirect("/listings");
}