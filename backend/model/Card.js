const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const datefns  = require('date-fns')


mongoose.model("Cards", {
    MoMoNumber: Number,
    NetworkProvider: String,
    Pin: String,
    NameOfCard: String,
    Amount: Number,
    TimeOfExpiry: String,
    cardNumber: {
        type:  Number
    },
    customId: {
        type: String,
        required: true
    },
    thirdPartyId: {
        default: uuidv4(),
        type: String,
        required: true
    },
    DateCreated : String


},"Cards")

module.exports = mongoose.model('Cards')