const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campsiteSchema} = require('../validationSchemas.js');

const Campsite = require('../models/campsite');


const validateCampsite = (req, res, next) => {
    const {error} = campsiteSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index', {campsites});
}));

router.get('/new', (req, res) => {
    res.render('campsites/new');
});

router.post('/', validateCampsite, catchAsync(async (req, res, next) => {
    // if(!req.body.campsite) throw new ExpressError('Invalid data', 400);
    const campsite = new Campsite(req.body.campsite);
    await campsite.save();
    req.flash('success', 'Successfully made a campsite!!');
    res.redirect(`/campsites/${campsite._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campsite = await Campsite.findById(req.params.id).populate('reviews');
    if(!campsite){
        req.flash('error', 'Cannot find that campsite');
        return res.redirect('/campsites');
    }
    // console.log(campsite);
    res.render('campsites/show', { campsite });
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    if(!campsite){
        req.flash('error', 'Cannot find that campsite');
        return res.redirect('/campsites');
    }
    res.render('campsites/edit', { campsite });
}))

router.put('/:id',  validateCampsite, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
    req.flash('success', 'Campsite Updated!');
    res.redirect(`/campsites/${campsite._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campsite.findByIdAndDelete(id); 
    req.flash('success', 'Campsite Deleted!');
    res.redirect('/campsites');
}))

module.exports = router;