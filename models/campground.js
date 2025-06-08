const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js')

const CampgroundSchema = new Schema({
    title : String,
    images : [
        {
            url : String,
            filename : String
        }
    ],
    price : Number,
    description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

// delete the reviews from schema
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);