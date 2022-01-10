const dotenv  = require('dotenv')
const Notify = require('./controller/sockLogic')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const socket = require('socket.io')
const SMS = require('./controller/Sms')



// express App object
const app = express()

//http create server from express
const server = http.createServer(app)

// db config file
const db = require('./model/db_config')()


//apis config 
const userapi = require('./api/userapi')
app.use('/api/users', userapi)

const cardapi = require('./api/cardapi')
app.use('/api/cards', cardapi)

const sendMoneyApi = require('./api/sendMoneyApi')
app.use('/api/sendmoney', sendMoneyApi)

const accountSettings = require('./api/accountSettings')
app.use('/account', accountSettings)

// environment variables config
dotenv.config()

// io configuarations
let io  = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }})

io.on('connection', socket =>{
 // instance of Notify
 const notify = new Notify(socket)

    notify.credit()

    // notify.requestConnection()

    notify.requestConnection()

    notify.connectionPendingTimer()

    notify.acceptRequest()

    socket.on('disconnect', ()=>{

        console.log('disconnected')
    })
})


const port  =  process.env.CUSTOM_PORT ;
server.listen(port, ()=> console.log(`listening on Port ${port}`))

