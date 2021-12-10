const {campsiteSchema, reviewSchema} = require('./validationSchemas.js');
const ExpressError = require('./utils/ExpressError');
const Campsite = require('./models/campsite');
const Review = require('./models/review');

//check for login
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged In');
        return res.redirect('/login');
    }
    next();
}

//campsite validate
module.exports.validateCampsite = (req, res, next) => {
    const {error} = campsiteSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

//author of a campsite validate
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campsite = await Campsite.findById(id);
    if(!campsite.author.equals(req.user._id)){
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/campsites/${id}`);
    }
    next();
}

//author of review validate
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/campsites/${id}`);
    }
    next();
}


//review submission validate
module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}
