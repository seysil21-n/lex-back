const mongoose = require('mongoose')
const Utility = require('./Utility')
const bcrypt = require('bcrypt')



require('../model/Card')
const Cards = mongoose.model('Cards')

class VirtualCard extends Utility {
    constructor(){
        super()

        this.CardDetails;
    }

    // Generate new card number
    // @TODO : Regenerate another number if the number is already available
    GenerateCardNumber = () => {
        let randomNumber = 100
        let anoterNumber = 921
        
        while(randomNumber < 1000){

            anoterNumber = Math.ceil(Math.random().toFixed(1) * anoterNumber) 
            randomNumber = Math.ceil(Math.random().toFixed(1) * 927192) + anoterNumber

            if(randomNumber > 999){
                return  randomNumber
            }
        }

        return randomNumber
    }

    // Get card with cards Number
    GetCard = (cardNumber,callback) => {

        Cards.findOne({cardNumber: cardNumber})
        .then(result => {

        if(result){
            return callback(result)
        }

        })
        .catch(error=> {
            if(error) throw error
        } )

    }

    // Create card
    CreateCard = async (data) => {
        data.cardNumber = this.GenerateCardNumber()
        data.DateCreated = this.formatCurrentDate()
        data.TimeOfExpiry  = this.addHoursToExpiry(data.TimeOfExpiry, data.DateCreated)
        
        // hash pin
        let hash  = await this.HashKeys(data.Pin)
            
        data.Pin = hash
        new Cards(data)
        .save()
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            if (error) throw error
        })
            
                

    }

    DebitCard = (cardNumber, Amount, amountTransfered) => {
        return new Promise((resolve, reject) => {
            const currentBalance = Amount - amountTransfered
            Cards.findOneAndUpdate({cardNumber}, { Amount: currentBalance }, {useFindAndModify: true})
            .then(result => {
                console.log(result)
                resolve(`${amountTransfered} has been debited from ${cardNumber}`)
            })
            .catch(err => {if(err) throw err; reject('An error occured when debiting funds')})
        })
    }

    DeleteCard = (id) => {
        return new Promise((resolve, reject)=> {
        Cards.findByIdAndDelete(id)
        .then(response => {
           resolve(response)     
        })
        .catch(error => {
            reject(error)
        })

        })  
    }
}

module.exports = VirtualCard