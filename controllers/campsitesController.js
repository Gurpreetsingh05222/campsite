const Campsite = require('../models/campsite');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index =  async (req, res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index', {campsites});
}

module.exports.renderNewForm =  (req, res) => {
    res.render('campsites/new');
}

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

module.exports.renderEditForm = async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    if(!campsite){
        req.flash('error', 'Cannot find that campsite');
        return res.redirect('/campsites');
    }
    res.render('campsites/edit', { campsite });
}

module.exports.updateCampsite = async(req, res) => {
    const {id} = req.params;
    const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campsite.images.push(...imgs);
    await campsite.save();
    req.flash('success', 'Campsite Updated!');
    res.redirect(`/campsites/${campsite._id}`);
}

module.exports.deleteCampsite = async (req, res) => {
    const {id} = req.params;
    await Campsite.findByIdAndDelete(id); 
    req.flash('success', 'Campsite Deleted!');
    res.redirect('/campsites');
}