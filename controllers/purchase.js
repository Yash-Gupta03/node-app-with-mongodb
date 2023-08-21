const Razorpay = require("razorpay");
const Order = require("../models/order");
const userController = require('../controllers/users');
const jwt = require('jsonwebtoken')


function generateToken(id, ispremiumuser) {
  return jwt.sign({ userId: id, ispremiumuser }, process.env.TOKEN);
}

exports.purchasePremium = async (req, res, next) => {
  try {
    let rzp = new Razorpay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    const amount = 1000;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.log(JSON.stringify(err));
      }
      const userId = req.user.id;
      const newOrder = new Order({
        userId: userId,
        orderid: order.id,
        status: "PENDING",
      });
      await newOrder.save();
      return res.status(201).json({order, key_id:rzp.key_id});
      });
     } catch (err) {
    console.log(err);
  }
};

    //   req.user
    //     .createOrder({ orderid: order.id, status: "PENDING" })
    //     .then(() => {
    //       return res.status(201).json({ order, key_id: rzp.key_id });
    //     })
    //     .catch((err) => console.log(err));
    // });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.updateTransaction = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id })
      const promise1 = await order.updateOne({ paymentid: payment_id, status: "SUCCESSFULL" })
      const promise2 = await req.user.updateOne({ ispremiumuser: true })
      Promise.all([promise1, promise2]).then(()=>{
        return res.status(202).json({ success: true, message: "transaction successful", token:generateToken(req.user.id, true)});
      }).catch((err)=>{
        console.log(err);
      })
  } catch (err) {
    console.log(err);
  }
};
