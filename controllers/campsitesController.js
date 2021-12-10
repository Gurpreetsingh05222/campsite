const Campsite = require('../models/campsite');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//index page to show all campsites
module.exports.index =  async (req, res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index', {campsites});
}

//render the form to submit new campsite
module.exports.renderNewForm =  (req, res) => {
    res.render('campsites/new');
}

//create campsite
module.exports.createCampsite = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campsite.location,
        limit: 1
    }).send()
    const campsite = new Campsite(req.body.campsite);
    campsite.geometry = geoData.body.features[0].geometry;
    campsite.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campsite.author = req.user._id;
    await campsite.save();
    console.log(campsite);
    req.flash('success', 'Successfully made a campsite!!');
    res.redirect(`/campsites/${campsite._id}`);
}

//show the campsite
module.exports.showCampsite = async (req, res) => {
    const campsite = await Campsite.findById(req.params.id).populate({
        path:'reviews', 
        populate:{
            path: 'author'
        }
    }).populate('author');
    // console.log(campsite);
    if(!campsite){
        req.flash('error', 'Cannot find that campsite');
        return res.redirect('/campsites');
    }
    // console.log(campsite);
    res.render('campsites/show', { campsite });
}

//rendering edit form
module.exports.renderEditForm = async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    if(!campsite){
        req.flash('error', 'Cannot find that campsite');
        return res.redirect('/campsites');
    }
    res.render('campsites/edit', { campsite });
}

//sending update to db and saving
module.exports.updateCampsite = async(req, res) => {
    const {id} = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campsite.location,
        limit: 1
    }).send()
    const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
    campsite.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campsite.images.push(...imgs);
    await campsite.save();
    req.flash('success', 'Campsite Updated!');
    res.redirect(`/campsites/${campsite._id}`);
}

//delete a campsite
module.exports.deleteCampsite = async (req, res) => {
    const {id} = req.params;
    await Campsite.findByIdAndDelete(id); 
    req.flash('success', 'Campsite Deleted!');
    res.redirect('/campsites');
}