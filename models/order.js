const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: {
    type: Number,
  },
  paymentid: String,
  orderid: String,
  status: String,
})

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   paymentid: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

module.exports = mongoose.model('order', orderSchema);
