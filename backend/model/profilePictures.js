const mongoose = require('mongoose')

mongoose.model('profilePictures', {
 path: String,
 customID: String
}, "profilePictures")

module.exports = mongoose.model('profilePictures')