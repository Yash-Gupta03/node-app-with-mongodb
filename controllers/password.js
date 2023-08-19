const {v4: uuid} = require("uuid")
const Sib = require('sib-api-v3-sdk');
var path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();


const FPR = require('../models/forgotpasswordrequests');
const User = require('../models/user');


exports.forgotPassword = async (req, res, next)=>{

const validEmail = await User.findAll({where:{email:req.body.email}})

if(validEmail.length === 0){
    res.status(500).json({message:'Invalid Email'})
}
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API;

const transEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'y.yashgupta03@gmail.com',
    name:'yash G',
}

const receivers = [{
    email: req.body.email,
},]

const senduuid = uuid()

await FPR.create({uuid:senduuid, userId:validEmail[0].id, isactive:true})

transEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:'reset your password',
    textContent:`http://localhost:3000/password/resetpassword/${senduuid}`,
}).then((response)=>{
    console.log(res);
    res.status(200).json('Email Sent');
})
.catch(err=>console.log(err));    
}

exports.resetPassword = async (req, res, next)=>{
    console.log("Reset Password is initiated");
    const reqId = req.params.reqId;
    console.log('reqid------------------------------------------', reqId);
    const dbuuid = await FPR.findAll({where:{uuid:reqId}});
    console.log( 'dbuuid----------------------------------------',dbuuid);
    if(dbuuid.length === 0){
        res.status(500).send('Bad Request, try Again');
    }
    if(dbuuid[0].isactive == false){
        res.status(500).send('Bad Request, try Again');
    }
    
    res.status(200).send(`<html>
    <script>
        function formsubmitted(e){
            e.preventDefault();
        }
    </script>
    <body style="background-color: rgb(189, 244, 255);">
    <form action="/password/updatepassword/${dbuuid[0].id}" method="get">
        <label for="newpassword">Enter New password</label>
        <input name="newpassword" type="password" required></input>
        <button>reset password</button>
    </form>
    </body>
</html>
    `);
    res.end()    
}

exports.updatePassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        console.log(newpassword);
        console.log(resetpasswordid);
        FPR.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                // res.sendFile(path.join(__dirname,'../public','login.html'))
                                res.redirect(('/login.html'))
                                // res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}