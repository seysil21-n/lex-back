const express  = require('express')
const router = express.Router()
const cors = require('cors')
const authMeths = require('../auth/auth')

router.use(cors({
    origin: 'http://localhost:3000',
    credentials:true    
}))

router.use(express.json())
router.use(express.urlencoded({extended: true}))

router.post('/settings/profileUpdate', authMeths.isAuthenticated, (req,res)=> {
    
})

module.exports = router