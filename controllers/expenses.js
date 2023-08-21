const Expense = require("../models/expense");
const User = require('../models/user');
const mongoose  = require('mongoose');
// const sequelize = require("../utils/database");

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}


exports.addExpense = async (req, res, next) => {
  const { price, description, category } = req.body;
  if (
    isStringInvalid(price) ||
    isStringInvalid(description) ||
    isStringInvalid(category)
  ) {
    res.status(400).json({ message: "bad parameters" });
  }
  try{
  const total = Number(req.user.totalExpense) + Number(price);

  const userupdate = await User.updateOne({id:req.user.id},{totalExpense:total});

  const data = new Expense({
    price: price,
    description: description,
    category: category,
    userId: req.user.id,
  });
  data.save();
  res.json({ newExpenseDetail: data });
}catch(err){
  console.log(err);
}};

exports.getExpense = async (req, res, next) => {
  console.log('-------------------------------');
  console.log(req.user.id);
  const ITEMS_PER_PAGE = +req.query.limit;
  console.log(req.query.limit);
  const page = +req.query.page || 1;
  console.log(page);
  let totalItems = await Expense.countDocuments({userId: req.user.id});
  console.log(totalItems);
  let off = (page-1)* ITEMS_PER_PAGE;
  let l = ITEMS_PER_PAGE;
  const data = await Expense.find( { userId: req.user.id }).skip(off).limit(l);
  res.json({ allExpenseDetails: data,
  currentPage:page,
nextPage: page+1,
hasNextPage: ITEMS_PER_PAGE*page < totalItems,
hasPreviousPage: page>1,
previousPage: page-1,
lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE) });
};

exports.deleteExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    console.log(req.params.id);
    console.log("On delete");
    try{
    const expense = await Expense.find({_id:req.params.id});
    console.log(`expense = `, expense.price);
    // const total = Number(req.user.totalExpense) - Number(expense.price[0].price);
    // console.log(total);
    // const userupdate = await User.updateOne( {_id:req.user.id}, {totalExpense:total});
    const data = await Expense.deleteOne(
       { _id: req.params.id},
    );
    // await t.commit();
    res.status(200).json({ data: data });
  }catch(error){
    // await t.rollback();
  }
}

function uploadToS3(data, filename){
  const BUCKET_NAME = process.env.BUCKET;
  const IAM_USER_KEY = process.env.IAM_ACCESS_KEY;
  const IAM_USER_SECRET = process.env.IAM_SECRETACCESS_KEY;
  let s3bucket = new AWS.S3({
    accessKeyId : IAM_USER_KEY,
    secretAccessKey : IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  })
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  }
  return new Promise((resolve, reject)=>{
    s3bucket.upload(params, (err, s3res)=>{
      if(err){
        reject(err);
      }else{
        resolve(s3res.Location);
      }
    })
  })
}

exports.downloadExpenses =  async (req, res) => {
  const expenses  = await Expense.find( { userId: req.user.id });
  console.log(expenses);
  const stringifiedExpense = JSON.stringify(expenses);
  const userId = req.user.id;
  const filename = `Expense${userId}/${new Date()}.txt`;
  const fileUrl = await uploadToS3(stringifiedExpense, filename);
  console.log(fileUrl);
  res.status(200).json({fileUrl, success: true});
}


exports.getReport = async (req, res) => {
  const data = await Expense.find( { userId: req.user.id } );
  res.json({ reportDetails: data });
};