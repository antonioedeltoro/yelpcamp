const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        
        const camp = new Campground ({
            //YOUR USER ID
            author: '665a5f3d48c1411ce4bd67a8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur atque aperiam optio excepturi earum numquam aliquam repudiandae saepe, quaerat molestias! Quasi expedita aliquid provident pariatur voluptates eaque eum vitae ea! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            price,
            geometry: {
                type: "Point",
                coordinates: [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                 ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dru71u48u/image/upload/v1717717093/YelpCamp/gy2z8wk02hatj4dw3th2.jpg',
                  filename: 'YelpCamp/gy2z8wk02hatj4dw3th2'
                },
                {
                  url: 'https://res.cloudinary.com/dru71u48u/image/upload/v1717717093/YelpCamp/u8n3igvariyej4xoyjiu.jpg',
                  filename: 'YelpCamp/u8n3igvariyej4xoyjiu'
                }
            ]
              
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})