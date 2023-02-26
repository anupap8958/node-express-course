const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: 'nopic.png' },
    location: { lat: Number, lgn: Number },
}, {
    toJSON: { virtuals: true },
    collection: 'shops',
    timestamps: true,
});

schema.virtual('menus', {
    ref: 'Menu', // Link to the Menu model
    localField: '_id', // Find menus where `localField`
    foreignField: 'shop', // is equal to `foreignField`
});

const shop = mongoose.model('Shop', schema);

module.exports = shop;