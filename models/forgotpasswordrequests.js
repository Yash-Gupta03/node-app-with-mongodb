const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const forgotPasswordRequestsSchema = new Schema({
        uuid:{
        type:String,
      },
    userId:{
        type:Number,
    },
    isactive:{
        type:Boolean,
    }


})

// const ForgotPasswordRequests = sequelize.define("forgotpasswordrequests", {
//     uuid:{
//         type:Sequelize.STRING,
//       },
//     userId:{
//         type:Sequelize.INTEGER,
//     },
//     isactive:{
//         type:Sequelize.BOOLEAN,
//     }
// });

module.exports = mongoose.model('forgotPasswordRequests', forgotPasswordRequestsSchema);