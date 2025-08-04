const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js");
const ExpressError = require("../utils/ExpressError");

//review post route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewControllers.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports=router;
