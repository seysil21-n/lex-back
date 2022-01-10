const Vonage = require('@vonage/server-sdk')

class SMS {
    constructor() {

    }

    static SendSMS = (data) => {
        const vonage = new Vonage({
            apiKey: "16153087",
            apiSecret: "ZUPjW6M0zdpElh8q"
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