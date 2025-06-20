if(process.env.NODE_ENV != "production"){

    require("dotenv").config()
}


const express = require("express") ;
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const  LocalStrategy = require("passport-local")
const user = require("./models/user.js")




const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const users = require("./routes/user.js")
// const category = require("./routes/listing.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")))

// const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
const  dbUrl=process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}

main().then((res) => {
    console.log("connected to DB.")
}).catch((err) => {
    console.log(err)
});



const store =  MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET

    },
    touchAfter:24*3600,
 })

 store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
 })

const sessionoption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now() *7 *24*60*60*1000,
      maxAge:  7 *24*60*60*1000,
      httpOnly:true,
    }
}




app.use(session(sessionoption))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
})

app.get("/getcookie",(req,res)=>{
    res.cookie("color", "red",{signed:true});
    res.send("cookie")
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/listings/catogery",listings);

app.use("/",users);






app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})


app.use((err, req, res, next) => {
    let { statuscode = 500, messege = "something went wrong" } = err;
    console.error(err)
    // res.status(statuscode).send(messege)
    res.status(statuscode).render("error.ejs", { messege })
    // res.send("something went wrong check again")
})

app.listen(8080, () => {
})
