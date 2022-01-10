const mongoose  = require('mongoose')
const dotenv = require('dotenv').config()

module.exports = async () =>  {
    mongoose.connect(await process.env.DB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(()=> console.log('connected to db'))
    .catch(err=> err && console.log(err))

    const db = mongoose.connection

    // db.on('close', console.error.bind(console,'BD closed'))
    // db.on('open', console.log('DB opened'))
}