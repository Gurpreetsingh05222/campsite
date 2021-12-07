const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campsite = require('../models/campsite');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campsite.reviews.push(review);
    await review.save();
    await campsite.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campsites/${campsite._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campsite.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/campsites/${id}`);
}))

module.exports = router;