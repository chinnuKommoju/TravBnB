const express=require("express");
const router=express.Router();
// const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const userControllers = require("../controllers/users.js");


router.route("/signup")
    .get(userControllers.signupForm)
    .post(wrapAsync(userControllers.signUp));


router.route("/login")
    .get(userControllers.loginForm)
    .post(passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
    keepSessionInfo: true 
}),userControllers.login);

router.get("/logout",userControllers.logout);



module.exports=router;
