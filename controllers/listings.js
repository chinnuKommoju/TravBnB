const Listing=require("../models/listing.js");

const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'google', apiKey: process.env.GOOGLE_MAPS_API_KEY });


module.exports.index=async (req, res) => {
 const listings = await Listing.find({}).populate('owner');
  res.render("listings/index.ejs", { listings });
}

module.exports.searchListings=async(req,res)=>{
  let location = req.query.location || "";
  location=location.trim();
  if(!location){ 
     req.flash("error","Enter a Valid Location");
     return res.redirect("/listings");
  }
  const listings = await Listing.find({location: {$regex:location,$options:'i'}});
  if(listings.length==0){
    req.flash("error","No Listings Available At Your Desired Location");
    return res.redirect("/listings");
  }
  res.render("listings/search.ejs",{listings});
}

module.exports.newListingForm=(req, res) => {
  res.render("listings/new.ejs");
}

module.exports.show=async (req, res) => {
  const { id } = req.params; 
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  console.log(listing);
  if(!listing){
    req.flash("error","Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs",{ listing });
}


module.exports.createListing=async(req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={
    url: req.file.path,
    filename: req.file.filename
    };
  const geoData = await geocoder.geocode(req.body.listing.location);
  newListing.geometry = {
    type: 'Point',
    coordinates: [geoData[0].longitude, geoData[0].latitude]
  };
  await newListing.save();
  req.flash("success","New Listing created successfully!");
  res.redirect("/listings");
}


module.exports.editListing=async (req, res) => {
  const { id } = req.params; 
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing not found!");
    res.redirect("/listings");
  }
  let originalImage=listing.image.url;
  originalImage=originalImage.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing=async(req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing },{new:true});
  if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
  }
  console.log(listing);
  await listing.save();
  req.flash("success","Listing edited successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted successfully!");
  res.redirect("/listings");
}