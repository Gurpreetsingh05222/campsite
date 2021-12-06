const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campsite = require('./models/campsite');


mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campsites', catchAsync(async (req, res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index', {campsites});
}));

app.get('/campsites/new', (req, res) => {
    res.render('campsites/new');
});

app.post('/campsites', catchAsync(async (req, res, next) => {
    if(!req.body.campsite) throw new ExpressError('Invalid data', 400);
    const campsite = new Campsite(req.body.campsite);
    await campsite.save();
    res.redirect(`/campsites/${campsite._id}`);
}))

app.get('/campsites/:id', catchAsync(async (req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    res.render('campsites/show', { campsite });
}));

app.get('/campsites/:id/edit', catchAsync(async(req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    res.render('campsites/edit', { campsite });
}))

app.put('/campsites/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
    res.redirect(`/campsites/${campsite._id}`);
}))

app.delete('/campsites/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campsite.findByIdAndDelete(id);
    res.redirect('/campsites');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
})

//error handler
app.use((err, req, res, next) => {
    const {statusCode = 500 }= err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Running on port 3000");
});