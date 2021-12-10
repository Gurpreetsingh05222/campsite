const Campsite = require('../models/campsite');
const Review = require('../models/review');

//create a review
module.exports.createReview = async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campsite.reviews.push(review);
    await review.save();
    await campsite.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campsites/${campsite._id}`);
}

//delete a review
module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campsite.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/campsites/${id}`);
}