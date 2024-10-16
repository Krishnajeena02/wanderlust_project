const user = require("../models/user");


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async (req,res)=>{
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


}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
    }


    module.exports.login= async (req,res)=>{

        req.flash("success","Welcome back to Wanderlust!");
        // res.redirect(redirectUrl);
        let redirect = res.locals.redirectUrl || "/listings"
        res.redirect(redirect);
    
    }


    module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
               return next(err);
            }
            req.flash("success", "you are logged out")
            res.redirect("/listings")
        })
    }