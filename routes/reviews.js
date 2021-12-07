const express = require('express');
const router = express.Router({ mergeParams: true });

const Campsite = require('../models/campsite');
const Review = require('../models/review');

const {reviewSchema} = require('../validationSchemas.js');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    const review = new Review(req.body.review);
    campsite.reviews.push(review);
    await review.save();
    await campsite.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campsites/${campsite._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campsite.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/campsites/${id}`);
}))

module.exports = router;