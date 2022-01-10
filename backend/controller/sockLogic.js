const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');


// bringing in the user model
require("../model/Users")
let Users = mongoose.model('Users')

class Notify{

    constructor(socket){
        // for external use only
        this.socket = socket
        this.setPending;
    }

    credit = () => {
        this.socket.on('credit', socketPayload =>{
            // let payload = {}

            // Users.findOne({email: socketPayload.destinationEmail})
            // .then(response =>{
            //     // payload to emit to client 
            //     payload.message = `You have received ${socketPayload.amount} from ${response.email}.`
            //     payload.user = response
            //     // emit notifyCredit to client
            //     this.socket.broadcast.emit('notifyCredit', payload)

            //     console.log('Done')
            // })

            // .catch(err=>{
            //     console.log(err)
            // })
            this.socket.broadcast.emit('notify_credit_receiver', (socketPayload))
            console.log(socketPayload, '1')
        })
    }

    requestConnection = () => {
        this.socket.on('initiateConnection', payload => {
            console.log(payload)

            // check if theres no token
            if(payload.key.length < 1){
                return 'Unauthorized'
            }  

            // verify token if theres any
            try {

                const decoded = jwt.verify(payload.key, process.env.JWT_SECRET)
                console.log(decoded)

                if(decoded.id){
                    // find user sending the the request
                    Users.findOne({_id: decoded.id})
                    .then(result=>{
                        const connectionDetails = {sender: result.email, receiver: payload.email}
                        
                        this.socket.broadcast.emit('request_connection', connectionDetails) 
                        console.log(connectionDetails)
                    })
                    
                    .catch(error=> {
                        if (error) throw error
                    })

                }


            } 
            catch (error) {
                if(error) throw error
            }


           
        })
    }

    // set timer to stop connection request 
    // if receiver doesnt accept or reject connection

    connectionPendingTimer = () => {
        this.socket.on('request_connection', payload => {
            // console.log(payload)
        })
    }

    acceptRequest = () => {
        this.socket.on('status_of_request', payload=>{
            console.log(payload)

            try {
                const decoded = jwt.verify(payload.key, process.env.JWT_SECRET)
                
                // if decoded emit to sender that
                if(decoded){
                    if(payload.status === 'accept'){
                        this.socket.broadcast.emit('connection_approved', payload) 
                        console.log('s')
                    }

                    if(payload.status === 'reject'){
                        this.socket.broadcast.emit('connection_rejected', payload)
                        console.log('e')
                    }
                }
            } catch (error) {
                
            }
            this.socket.broadcast.emit('request_accepted', payload)
        })
    }

    
}

module.exports = Notify