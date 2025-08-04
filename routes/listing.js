const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingControllers=require("../controllers/listings.js");

//multer
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage,limits: {
    fileSize: 15 * 1024 * 1024
  }})

router.route("/")
// Index Route
    .get(wrapAsync(listingControllers.index))
//create route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,
        wrapAsync(
        listingControllers.createListing
    ))

router.get("/search",wrapAsync(listingControllers.searchListings));
// New Listing Form Route 
router.get("/new",isLoggedIn,listingControllers.newListingForm);


router.route("/:id")
//show route
    .get(wrapAsync(listingControllers.show))
// Update Route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingControllers.updateListing))
// Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing))


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editListing));


module.exports=router;