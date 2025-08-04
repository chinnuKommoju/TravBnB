
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoUrl = process.env.ATLAS_URL;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
  console.log("Connected to MongoDB");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

//session setup
const store = MongoStore.create({
  mongoUrl: mongoUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, 
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions)); // No second argument here
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



//all Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//error handler
app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// In app.js, at the very bottom

// REPLACE your final error handler with this one:

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  // This render call now provides default values for all variables
  // that the layout (boilerplate.ejs) needs to render successfully.
  res.status(statusCode).render("listings/error.ejs", { 
    message,
    // The following lines are the key fix.
    // They guarantee that 'success' and 'currUser' are ALWAYS defined,
    // even on an error page. We provide empty/null values so they just don't display anything.
    success: "", 
    error: "",   
    currUser: req.user
  });
});

//server setup
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});