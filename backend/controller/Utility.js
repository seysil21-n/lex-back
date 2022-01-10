const {format, addHours}  = require('date-fns')
const bcrypt = require('bcrypt');
const Users = require('../model/Users');
const mongoose = require('mongoose')

require('../model/SavedUsers')
const SavedUsers = mongoose.model('SavedUsers')

class Utilities {
    constructor(){
        this.HHoldSomething;
    }

    // get current date with datefns 
    formatCurrentDate = () => {
        const currentDate = format(new Date(), 'MM/dd/yyyy/pp');
        return currentDate;
    }

    // add hours to time of expiry 
    addHoursToExpiry = (hourText, dateCreated) => {
        const getHours = hourText.split(' ')
        const hours = parseInt(getHours[0])
        
        const result = addHours(new Date(dateCreated), hours)

        return result

    }

    HashKeys = (key) => {
        return new Promise((resolve, reject)=>{

            bcrypt.hash(key, 10)
            .then(hash => {
                resolve(hash)
            })
            .catch(error=> {
                if(error)
                    reject(error)
            })

        }) 
        
    }

    FindUser = (email) => {
        return new Promise((resolve, reject)=> {
            Users.findOne({email})
            .select('-password')
            .then(result=> {
                resolve(result)
            })
            .catch(err => {
                if(err) {
                    reject(err)
                    throw err
                }
            })
        })
    }

    FindSavedUser = (email) => {
        return new Promise((resolve,reject)=> {
            SavedUsers.findOne({email})
            .then(result=> {
                resolve(result)
            })
            .catch(err=> { if(err) reject('oops something went wrong')  })
        })
    }

    SaveUser = (data) => {
        return new Promise((resolve, reject)=> {
            this.FindSavedUser(data.email)
            .then(result=>{
                if(result)
                     return 'user is already saved'

                if(!result){
                    new SavedUsers(data)
                        .save()
                        .then(response=> {
                            resolve(response)
                        })
                        .catch(error=> {
                            reject('oops something went wrong')
                            if(error) throw error
                        })
                }

            })
            .catch(err=> {if(err) throw err})
        })
    }

}

module.exports = Utilities