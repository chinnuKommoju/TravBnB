const mongoose = require('mongoose');
const {Schema}=mongoose;
const Review=require("./review.js");
const listingSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: String,
    filename: String
  },
  geometry: {
    type: {
      type: String, // Don't forget to include this type field
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing && listing.reviews.ength){
      await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})
const Listing= mongoose.model('Listing', listingSchema);
module.exports = Listing;

