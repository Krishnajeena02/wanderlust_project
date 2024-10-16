const express = require("express");
const user = require("../models/user");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirect } = require("../middleware");

const userController = require("../controllers/user.js")


router.get("/signup", userController.renderSignupForm)

router.post("/signup", wrapAsync( userController.signup) );



router.get("/login", userController.renderLoginForm )

router.post("/login",savedRedirect, passport.authenticate("local",
    {failureRedirect:"/login",
 failureFlash:true}),
 wrapAsync(userController.login ))

router.get("/logout",userController.logout)



module.exports= router