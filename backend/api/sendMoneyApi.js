const express  = require('express')
const authMeths = require('../auth/auth')
const router = express.Router()
const cors = require('cors')
const Utilities = require('../controller/Utility')
const VirtualCard = require('../controller/Cards')
const Paystack = require('../controller/Paystack')
const SMS = require('../controller/Sms')


const _Utility = new Utilities()
const _VirtualCard  =  new VirtualCard()
const _Paystack = new Paystack()
const _Sms = new SMS()

router.use(cors({
    origin: 'http://localhost:3000',
    credentials:true    
}))


router.use(express.json())
router.use(express.urlencoded({extended: true}))


// @todo:fetch user with email if 
router.post('/initiatetransfer', authMeths.isAuthenticated, (req,res)=> {
    const { ReceipientWallet,  Amount, SelectedNetwork, PayWith, Email, SaveUser} = req.body

    // @todo add registered number to HoldSomething object 

    if(SelectedNetwork === 'direct') {
        
        // check to see if saved user is true
        if(SaveUser){

            // find receiver and save it against the sender
            _Utility.FindUser(ReceipientWallet)
            .then(result => {
                
                const {name, email,phone} = result

                if(result){

                    _Utility.SaveUser({name, email, phone, customId: req.user.id})
                    .then(result=> {
                    console.log('user saved successfully', result)
                    })
                    .catch(err=> {
                    if(err) throw err
                    })
                }
                
            
            })
            .catch(err=> { if(err) throw err })
        }

        _Utility.HHoldSomething  = {PayWith, Amount, Email, ReceipientWallet}
        _Utility.FindUser(ReceipientWallet)
        .then(response => {
             _Utility.HHoldSomething.phone = response.phone
             return res.send(response).status(200)
        })
        .catch(err=> {
            if(err) throw err
        })
        
    }

    console.log(req.body)
})

router.post('/charge_user_for_transfer', authMeths.isAuthenticated, (req,res)=> {
   _VirtualCard.GetCard(_Utility.HHoldSomething.PayWith, (result)=> {

    const PaystackData = {
        amount: _Utility.HHoldSomething.Amount + '00',
        email: 'customer@email.com',
        mobile_money: {
            phone: result.MoMoNumber,
            provider: result.NetworkProvider
        }
    }

       _Paystack.charge(PaystackData, response=> {
            if(response)   
                return res.send(response.data)
       })

   })

   console.log(_Utility.HHoldSomething, req.body)
})

router.get('/verify_debit_for_transfer/:reference', authMeths.isAuthenticated, (req,res)=> {
    // check to see if payment has gone through
    _Paystack.verifyPayment(req.params.reference, response=>{
        if(response.status === 'success'){

            const refundData = {
                transaction: response.reference,
                amount: _Utility.HHoldSomething.Amount + '00'
            }
            
            //refund money if the transaction was successful 
            _Paystack.refund(refundData)
                .then(response=> {
                    // find card
                    _VirtualCard.GetCard(_Utility.HHoldSomething.PayWith, result=> {
                        const {cardNumber, Amount} = result
                        const amountTransfered = _Utility.HHoldSomething.Amount - 0

                        // debit card
                        _VirtualCard.DebitCard(cardNumber, Amount, amountTransfered)
                        .then(result => {

                            // implement to send messages when the card is debited
                            // const SmsData = {
                            //     from: 'Vonage',
                            //     to: '233' + _Utility.HHoldSomething.phone,
                            //     text: `TEST: you have just received ${_Utility.HHoldSomething.Amount} from ${_Utility.HHoldSomething.Email}`
                            // }

                            SMS.SendSMS(SmsData)
                            
                            return res.send({response: 'success', message: `You've just sent ${_Utility.HHoldSomething.ReceipientWallet}`}).status(200)
                        })
                        .catch(err => {
                            if(err) throw err   
                        })
                    })
                })

                .catch(error=> {
                    if(error) 
                        console.log(error)
                })
            
        }

        else{
            console.log(_Utility.HHoldSomething)
            return res.send({error: "You didnt authorize the transaction, try again"})
        }

        console.log(_Utility.HHoldSomething)
    })


})

module.exports = router