const express = require("express");

const userController = require("../controllers/users");

const authController = require("../middlewares/authentic");
const purchaseController = require("../controllers/purchase");

const router = express.Router();

router.use("/sign-up", userController.signUp);

router.use("/login", userController.login);



router.use(
  "/purchase/premiummembership",
  authController.authenticate,
  purchaseController.purchasePremium
);

router.use(
  "/purchase/updatetransactionstatus",
  authController.authenticate,
  purchaseController.updateTransaction
);

module.exports = router;
