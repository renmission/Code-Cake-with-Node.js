const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    facebookId: String
});

userSchema.methods.setPassword = (password) => {
    this.salt = crypto
        .randomBytes(16)
        .toString('hex');

    this.hash = crypto
        .createHash('sha1')
        .update(password, this.salt, 'hex')
        .digest('hex')
};



userSchema.methods.validPassword = (password) => {
    var hash = crypto
        .createHash('sha1')
        .update(password, this.salt, 'hex')
        .digest('hex')

    return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);