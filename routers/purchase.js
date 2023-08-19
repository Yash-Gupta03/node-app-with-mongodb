const express = require("express");

const authController = require("../middlewares/authentic");
const purchaseController = require("../controllers/purchase");

const router = express.Router();

router.use(
  "/premiummembership",
  authController.authenticate,
  purchaseController.purchasePremium
);

router.use(
  "/updatetransactionstatus",
  authController.authenticate,
  purchaseController.updateTransaction
);

module.exports = router;
