const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Listing = require("../models/listing.js"); // Changed to match model naming convention
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const listings = await Listing.find({ category: category });

        if (!listings || listings.length === 0) {
            req.flash("error", `No listings found in category: ${category}`);
            return res.redirect("/listings");
        }

        res.render("listings/index.ejs", { alllistings: listings });
    } catch (err) {
        console.error("Error while filtering by category:", err);
        req.flash("error", "Something went wrong while filtering listings.");
        res.redirect("/listings");
    }
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listings) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listings });
};



module.exports.createListing = async (req, res, next) => {
    if (!req.user) {
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    if (response.body.features.length === 0) {
        req.flash("error", "Location not found");
        return res.redirect("back"); // Go back to the previous page
    }

    const newListing = new Listing(req.body.listing);
    newListing.image = { url: req.file.path, filename: req.file.filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    let save = await newListing.save();
    console.log(save);

    req.flash("success", "New listing created");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);

    if (!listings) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    let originalImage = listings.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250"); // Adjust image size

    res.render("listings/edit.ejs", { listings, originalImage });
};

module.exports.updateListing = async (req, res) => { 
    let { id } = req.params;

    // Check if the location has been updated
    if (req.body.listing.location) {
        // Geocode the new location
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        // Check if the geocoding response is valid
        if (response.body.features.length === 0) {
            req.flash("error", "Location not found");
            return res.redirect("back");  // Go back to the previous page
        }

        req.body.listing.geometry = response.body.features[0].geometry;
    }

    // Find and update the listing
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // If a new image file is uploaded, update the image as well
    if (req.file) {
        updatedListing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Save the updated listing
    await updatedListing.save();

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");
    res.redirect("/listings");
    console.log(deleted);
};