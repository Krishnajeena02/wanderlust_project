const mongoose = require("mongoose");



const reviewschema = new mongoose.Schema({

    comment:String,

    rating:{
        type:Number,
        min:1,
        max:5
    },

    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const review = mongoose.model("review",reviewschema );
module.exports = review;