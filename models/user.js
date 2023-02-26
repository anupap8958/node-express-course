const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, index: true },
    password: { type: String, required: true, trim: true, minlength: 3 },
    role: { type: String, default: 'member' },
}, {
    collection: 'users'
});

schema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const user = mongoose.model('User', schema);

module.exports = user;