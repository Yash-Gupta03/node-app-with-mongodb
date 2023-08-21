const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const expenseSchema = new Schema({
  id: {
        type: Number,
      },
      price: {
        type: String,
      },
      description: {
        type: String,
      },
      category: {
        type: String,
      },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }

})

// const Expense = sequelize.define("expense", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   price: {
//     type: Sequelize.STRING,
//   },
//   description: {
//     type: Sequelize.STRING,
//   },
//   category: {
//     type: Sequelize.STRING,
//   },
// });

// module.exports = Expense;
module.exports = mongoose.model('expense', expenseSchema);