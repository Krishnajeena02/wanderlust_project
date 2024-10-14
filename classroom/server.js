const express = require("express");
const app = express();
const session = require("express-session");
const flash= require("connect-flash");
const path= require("path")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionoption = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionoption))
app.use(flash());
// app.get("/test", (rq,res)=>{
//     res.send("test succesful")
// })

app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success")
res.locals.errormsg=req.flash("error")
next()
})

app.get("/register", (req,res)=>{
    let { name="nothing"} = req.query;
    req.session.name=name;
    // req.flash('success', 'user registred successfully')

    if(name==="nothing"){
        req.flash("error", "user not register")
        
    }else{
        req.flash("success", "user register  succesfully")
    }
    res.redirect("/hello");
})

app.get("/hello", (req,res)=>{

res.render("page.ejs" ,{name:req.session.name})
})

app.listen(3000,()=>{
    console.log("server started")
})

