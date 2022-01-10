const mongoose = require('mongoose')

mongoose.model('SavedUsers', {
    name: String,
    email: String,
    profilePicture: String,
    customId: String,
    phone: Number
}, 'SavedUsers')

module.exports = mongoose.model('SavedUsers')