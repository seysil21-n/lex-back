const Vonage = require('@vonage/server-sdk')

class SMS {
    constructor() {

    }

    static SendSMS = (data) => {
        const vonage = new Vonage({
            apiKey: "<api key>",
            apiSecret: "<api secret"
          })

        vonage.message.sendSms(data.from, data.to, data.text, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    }
}

module.exports = SMS
