if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}const mongoose=require("mongoose");
const path = require('path');
const MONGO_URL='mongodb://127.0.0.1:27017/TravBnB';
const Listing=require(path.join(__dirname,"../models/listing.js"));
const listings=require("./data.js");
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'google', apiKey: process.env.GOOGLE_MAPS_API_KEY });

async function seedData(){
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
        await Listing.deleteMany({});
        console.log("Existing listings deleted");
        const listingsWithGeo = [];
        const geocodedListings = [];
        for (let listing of listings.data) {
            const geoData = await geocoder.geocode(listing.location);
            if (!geoData.length) continue;
            listing.owner = '688fa8894ff756287616909d';
            listing.geometry = {
                type: "Point",
                coordinates: [geoData[0].longitude, geoData[0].latitude]
                };
            geocodedListings.push(listing);
        }   

        await Listing.insertMany(geocodedListings);
        console.log("New listings added");
    }
    catch(err){
        console.error("Error seeding data:", err);
    }
    finally{
        await mongoose.connection.close();
    }
}
seedData();