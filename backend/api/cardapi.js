const express  = require('express')
const router = express.Router()
const Paystack  = require('../controller/Paystack')
const authMeths  = require("../auth/auth")
const { isAuthenticated } = require('../auth/auth')
const bcrypt = require('bcrypt')
const EventEmitter = require('events');
const CardEmitter = new EventEmitter();
const cors  = require('cors')
const Cards = require('../controller/Cards')


const _PayStack = new Paystack()
const _Cards = new Cards()


router.use(express.json())
router.use(express.urlencoded({extended: true}))

router.use(cors({
    origin: 'http://localhost:3000',
    credentials:true    
}))

// @private create virtual card 
router.post('/authBank', authMeths.isAuthenticated , (req,res) => {

    let requestData = {...req.body, 
        customId: req.user.id, 
    }
    let {MoMoNumber,NetworkProvider,Pin,NameOfCard,Amount,TimeOfExpiry,email} = req.body
    // console.log(requestData)

    let paystackData = { 
        amount: 100,
        email,
        currency: "GHS",
        mobile_money: {
          phone : MoMoNumber,
          provider : NetworkProvider
            }
        }

    _PayStack.charge(paystackData, (response)=>{

        if(response.error){
            return res.send(response)
        }

        if(!response.error){
            _Cards.cardDetails = requestData
            return res.send({paystackResponse:response.data, cardDetails:paystackData})

        }
    })
    
})

router.get('/verifyPayment/:reference', authMeths.isAuthenticated,(req,res)=> {
    let reference = req.params.reference

    // let _paystack = new Paystack();

    _PayStack.verifyPayment(reference, (response) => {
        
        if(response.status === 'success'){
            _Cards.CreateCard(_Cards.cardDetails)
        }

        if(response.status !== 'success'){
            _Cards.CreateCard(_Cards.cardDetails)
            
        }

        return res.send(response).status(200)
    });

})

router.delete('/delete/:id', authMeths.isAuthenticated, (req,res) => {
    const id = req.params.id

    _Cards.DeleteCard(id)
    .then(response => {
        if(response){
            res.send('Card deleted successfully').status(200)
        }
    })
})

module.exports = router