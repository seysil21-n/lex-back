const mongoose = require('mongoose')


// @TODO: delete the card fields
mongoose.model('Users', {
    name:String,
    email: String,
    phone: Number || String,
    password: String,
    selectedCard: {type: String, default:''},
    selectedCardNumber: {type: String, default:''},
    selectedCardBalance: {type: String, default:''},
    secureConnectionPendingStatus: String,
},"users")

module.exports = mongoose.model('Users')