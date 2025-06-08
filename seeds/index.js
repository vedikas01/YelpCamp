const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    // await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand528 = Math.floor(Math.random() * 528);
        const camp = new Campground({
            author : '6844001590f39e77530a4ea9',
            location: `${cities[rand528].city}, ${cities[rand528].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur blanditiis est consectetur! At temporibus facilis maxime sequi incidunt aspernatur dolorum asperiores magnam rem officia illo nihil, excepturi similique odio soluta!',
            price : `${Math.floor(Math.random()*200)+10}`
        })
        await camp.save();
    }
}

seedDB();