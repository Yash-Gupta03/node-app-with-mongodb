const Expense = require("../models/expense");
const User = require('../models/user');
const sequelize = require("../utils/database");
const AWS = require('aws-sdk'); 

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}


exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
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
  const userupdate = await User.update({totalExpense:total}, {where:{id:req.user.id}}, {transaction:t});
  const data = await Expense.create({
    price: price,
    description: description,
    category: category,
    userId: req.user.id,
  }, {transaction:t});
  await t.commit();
  res.json({ newExpenseDetail: data });
}catch(err){
  await t.rollback();
  console.log(err);
}};

exports.getExpense = async (req, res, next) => {
  const ITEMS_PER_PAGE = +req.query.limit;
  console.log(req.query.limit);
  const page = +req.query.page || 1;
  console.log(page);
  let totalItems = await Expense.count({where:{userId:req.user.id}});
  console.log(totalItems);
  const data = await Expense.findAll({ where: { userId: req.user.id }, offset: (page-1)* ITEMS_PER_PAGE,
limit:ITEMS_PER_PAGE });
  res.json({ allExpenseDetails: data,
  currentPage:page,
nextPage: page+1,
hasNextPage: ITEMS_PER_PAGE*page < totalItems,
hasPreviousPage: page>1,
previousPage: page-1,
lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE) });
};

exports.deleteExpense = async (req, res, next) => {
  
    const t = await sequelize.transaction();
    try{
    const price = await Expense.findAll({where:{id:req.params.id}, attributes:['price']},{transaction:t});
    console.log(`price = `, price);
    const total = Number(req.user.totalExpense) - Number(price[0].price);
    const userupdate = await User.update({totalExpense:total}, {where:{id:req.user.id}}, {transaction:t});
    const data = await Expense.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    await t.commit();
    res.status(200).json({ data: data });
  }catch(error){
    await t.rollback();
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
  const expenses  = await Expense.findAll({ where: { userId: req.user.id } });
  console.log(expenses);
  const stringifiedExpense = JSON.stringify(expenses);
  const userId = req.user.id;
  const filename = `Expense${userId}/${new Date()}.txt`;
  const fileUrl = await uploadToS3(stringifiedExpense, filename);
  console.log(fileUrl);
  res.status(200).json({fileUrl, success: true});
}


exports.getReport = async (req, res) => {
  const data = await Expense.findAll({ where: { userId: req.user.id } });
  res.json({ reportDetails: data });
};