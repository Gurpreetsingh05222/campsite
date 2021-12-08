const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: {virtuals: true }};

const CampsiteSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampsiteSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campsites/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
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