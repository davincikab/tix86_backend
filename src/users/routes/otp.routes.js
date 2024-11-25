const express = require('express');
const otpController = require('../controller/otp.controller');
const router = express.Router();


router.post('/send-otp', otpController.sendOTP);
module.exports = router;