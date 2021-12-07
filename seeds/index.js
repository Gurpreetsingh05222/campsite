const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campsite = require('../models/campsite');

mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campsite.deleteMany({});
    for(let i = 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campsite({
            author: '61aeff836c88172b9ac0f262',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet consequuntur blanditiis ea placeat architecto. Fuga, exercitationem mollitia eaque saepe quaerat atque suscipit iste tempora nulla nobis debitis laborum rerum quis?",
            price
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
});