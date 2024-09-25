const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const{listingschema}= require("./schema.js")
const review = require("./models/review.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")))

const mongourl =  "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(mongourl);
}

main().then((res)=>{
    console.log("connected to DB.")
}).catch((err)=>{
    console.log(err)
});

app.get("/", (req,res)=>{
    res.send("hi i am krishna")
});

const validatelisting= (req,res,next)=>{
    let {error}=  listingschema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg)
    }else{
        next();
    }
}

//index route
app.get("/listings", wrapasync( async (req,res)=>{
 const alllistings =   await listing.find({})
        res.render("listings/index.ejs",{alllistings});
    

}));

///new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",wrapasync( async (req,res)=>{
let {id} = req.params;
 const listings= await listing.findById(id);
 res.render("listings/show.ejs",{listings})

}));

//create route
app.post("/listings",validatelisting, wrapasync(async(req,res,next)=>{
   
   console.log(req.body) 
    
        const newlisting= new listing(req.body.listing);
       
        await newlisting.save();
    
    res.redirect("/listings");
    } )
);

    


//edit route
app.get("/listings/:id/edit", wrapasync(async (req,res)=>{
    let {id} = req.params;
 const listings= await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
}));

//update route
app.patch("/listings/:id", wrapasync( async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing")
       }
    let {id} = req.params;
await listing.findByIdAndUpdate(id,{ ...req.body.listing});
res.redirect(`/listings/${id}`);
}));


//delete ROUTE
app.delete("/listings/:id",  wrapasync( async (req,res)=>{
    let {id} = req.params;
    let deleted =  await listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log(deleted);
}));


// reviews 
// post route

app.post("/listings/:id/reviews", async (req,res)=>{
    let listings= await listing.findById(req.params.id);
let newreview = new review(req.body.review);

listings.review.push(newreview);
await newreview.save();
await listing.save();
console.log("new review saved")
res.send("new review saved")
})



app.all("*", (req,res,next)=>{
   next(new ExpressError(404, "page not found")) 
})
 

app.use((err, req,res,next)=>{
    let{statuscode=500,messege="something went wrong"}=err;
    // res.status(statuscode).send(messege)
    res.status(statuscode).render("error.ejs",{messege})
    // res.send("something went wrong check again")
})

app.listen(8080,()=>{
    console.log("server is listening to 8080")
})
