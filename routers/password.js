const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password');

router.use('/forgotpassword', passwordController.forgotPassword);

router.use('/resetpassword/:reqId', passwordController.resetPassword);

router.use('/updatepassword/:resetpasswordid', passwordController.updatePassword);

module.exports = router;