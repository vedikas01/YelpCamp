if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const { request } = require('http');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

//tells express to use EJS as the default view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

//parse the req body 
app.use(express.urlencoded({extended : true}))

//method override
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

//cookies
const sessionConfig = {
    secret : 'thisbetterbeasecret!!',
    resave : false,
    saveUninitialised : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// initialize passport & login sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req,res,next)=>{
    console.log(request.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// connecting to routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

//home 
app.get('/', (req,res)=>{
    res.render('home.ejs');
})

//error handling
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No! Something went wrong!!"
    res.status(statusCode).render('error', {err});
})

//admin user
// const createUser = async () => {
//     const user = new User({ username: 'vedika_01', email: 'vedikas2003@gmail.com'});
//     await user.setPassword('mahak'); // if using passport-local-mongoose
//     await user.save();
//         console.log(user._id);
// };
// createUser();



app.listen(3000,()=>{
    console.log("SERVING ON PORT 3000");
} )