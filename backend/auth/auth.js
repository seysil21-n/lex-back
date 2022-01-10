const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authMeths = {
    // authenticate user
    authenticate: (req,res,next,Users) => {
        let user = req.body
        console.log(user)

        // find the email in the db
        Users.findOne({email: user.email})
                .then(response=>{
                    // check if email exits before decrypting password
                    if(!response)
                        return res.send({err: 'Theres no Account with this Email'})
                        

                    // compare hashed password with plain text password
                    bcrypt.compare(user.password, response.password, function(err, result) {
                        if(!result) return res.send({err: 'Something went wrong check your Email and Password'})
                            
                        jwt.sign({id: response.id}, process.env.JWT_SECRET, (err,token)=>{
                            if(err) throw err

                            res.send({token, user: {name: response.name,email:response.email,phone:response.phone,id: response.id, profilePicture: response.profilePicture}})
                        })
                    });
    
    
                })
                .catch(err=>{
                    if(err) throw err
                })
    
    },

    // // chech to see if user is authenticated and authorise

    isAuthenticated :  (req,res,next) => {
            // console.log(req.session.user)
            // check to see if the user is already logged in
            // check for token 
            const token = req.header("x-auth-token")
            console.log(token)
            if(!token){
                return res.status(401).send({err: 'No Token, not authorised' })
            }

            try {
                // verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                // add user from payload
                req.user = decoded;
                next()
            } catch (error) {
                res.status(401)
            }

            
        }
        
}

module.exports = authMeths

