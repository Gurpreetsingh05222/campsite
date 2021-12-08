const express = require('express');
const router = express.Router();
const campsites = require('../controllers/campsitesController');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampsite} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

const Campsite = require('../models/campsite');

router.route('/')
    .get(catchAsync(campsites.index))
    .post(isLoggedIn,  upload.array('image'), validateCampsite, catchAsync(campsites.createCampsite))
    
router.get('/new', isLoggedIn, campsites.renderNewForm);

router.route('/:id')
    .get(catchAsync(campsites.showCampsite))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampsite, catchAsync(campsites.updateCampsite))
    .delete(isLoggedIn, isAuthor, catchAsync(campsites.deleteCampsite))
    
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campsites.renderEditForm));

module.exports = router;