const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    address: {
        province: String,
    }
}, {
    collation: "companies"
});

const companyModel = mongoose.model('Company', schema);

module.exports = companyModel;