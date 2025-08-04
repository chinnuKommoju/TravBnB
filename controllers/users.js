const User=require("../models/user.js");

module.exports.signupForm=async (req,res,next)=>{
        res.render("users/signup.ejs");
    };

module.exports.signUp=async(req,res)=>{
    try{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to TravBnB!");
        res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login= (req,res)=>{
    req.flash("success","Welcome to TravBnB!");
    const redirectUrl = req.session.redirectUrl || "/listings"; 
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","You Logged Out Successfully");
    res.redirect("/listings");
    })
}