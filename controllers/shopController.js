const Shop = require('../models/shop');
const Menu = require('../models/menu');
const config = require('../config/config');

const funcImg = require('../unity/funcImg');

exports.index = async (req, res, next) => {

    const shop = await Shop.find().select('name photo location');

    const shopWithPhotoDomain = await shop.map((shop, index) => {
        return {
            id: shop.id,
            name: shop.name,
            photo: `${config.DOMAIN}/images/${shop.photo}`,
            location: shop.location,
        }
    });

    res.status(200).json({
        data: shopWithPhotoDomain,
    });
}

// get menu
exports.menu = async (req, res, next) => {
    const menu = await Menu.find().populate('shop', 'name photo location').select('name price shop');
    // const menu = await Menu.find().select('name price shop');
    // const menu = await Menu.find().select('+name -price shop');
    // const menu = await Menu.find().select('name price shop').limit(2).skip(2);
    // const menu = await Menu.find().where('price').gte(100).select('name price shop');

    res.status(200).json({
        data: menu,
    });
}

// get shop by id with menu
exports.getShopWithMenu = async (req, res, next) => {
    const { id } = req.params;

    const shop = await Shop.findById(id).populate('menus', 'name price').select('name photo location');
    shop.photo = `${config.DOMAIN}/images/${shop.photo}`;

    res.status(200).json({
        data: {
            shop
        },
    });
}

exports.insert = async (req, res, next) => {

    try {
        const { name, location, photo } = req.body;

        const shop = new Shop({
            name: name,
            location: location,
            photo: await funcImg.saveImageToDisk(photo),
            // photo: await funcImg.saveImageToGoogle(photo),
        });
    } catch (error) {
        res.status(500).json({
            data: { message: error.message },
        });
    }

    await shop.save().then(() => {
        res.status(201).json({
            data: { message: 'inserted', shop: shop },
        });
    }).catch((err) => {
        res.status(500).json({
            data: { message: err.message },
        });
    });
}

