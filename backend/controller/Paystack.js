const axios = require('axios')
 
 class Paystack {
    constructor(){
        this.Authorization = process.env.PAYSTACK_AUTH
        // this.CardDetails;
    }

    // charge api
    charge =  (paystackData, callback) => {
        axios.post('https://api.paystack.co/charge',
            paystackData,
            {headers: {"authorization": this.Authorization}})

            .then(response => {
                
                return callback(response)

            })
            .catch(error=> {
            if(error){
                console.log(error)
                return callback({error: "Sorry we could'nt process your request, check your mobile number and try again'"})
            } 
            })
    }

    verifyPayment = (reference,callback) => {
        axios.get('https://api.paystack.co/transaction/verify/' + reference, 
        {headers: {'authorization': this.Authorization}})
        .then(response => {
            callback(response.data.data)
        })
        .catch(error=> {
            if(error) console.error(error)
        })
    }

    refund = (data) => {
        return new Promise((resolve,reject) => {

                axios.post('https://api.paystack.co/refund', 
                data,
                {headers: {'authorization': this.Authorization}})
                .then(response => {
                     resolve(response)
                })

                .catch(error => {
                    if(error)
                        reject(error)
                }) 

        })
    }

}

module.exports = Paystack