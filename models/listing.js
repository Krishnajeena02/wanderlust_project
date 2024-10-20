const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./review.js")

const listingschema = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        filename:  String,
      url:    String,   
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"user",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
});

listingschema.post("findOneAndDelete", async (listing)=>{
   if(listing){


    await review.deleteMany({_id:{$in: listing.reviews}})
}

})

const listing = mongoose.model("listing", listingschema);
module.exports = listing;