const express = require("express");
const user = require("../models/user");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirect } = require("../middleware");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync( async (req,res)=>{
    try
    {
    let {username,email,password} = req.body;
    let newUser =  new user({email,username});
    let registeredUser = await user.register(newUser,password);
    
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash('success',"Welcome to WanderLust!");
        res.redirect('/listings');
    })
    
       

    }
    catch(err){
        req.flash('error',err.message);
        res.redirect('/signUp');
    }


}) );


router.get("/login", (req,res)=>{
res.render("users/login.ejs")
})

router.post("/login",savedRedirect, passport.authenticate("local",
    {failureRedirect:"/login",
 failureFlash:true}),
 wrapAsync(
  async (req,res)=>{

    req.flash("success","Welcome back to Wanderlust!");
    // res.redirect(redirectUrl);
    let redirect = res.locals.redirectUrl || "/listings"
    res.redirect(redirect);

} ))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out")
        res.redirect("/listings")
    })
})



module.exports= router