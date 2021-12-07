const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampsiteSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//delete the reviews related to campsite after it is deleted
CampsiteSchema.post('findOneAndDelete', async function(reviewDoc) {
    if(reviewDoc){
        await Review.deleteMany({
            _id: {
                $in: reviewDoc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campsite', CampsiteSchema);