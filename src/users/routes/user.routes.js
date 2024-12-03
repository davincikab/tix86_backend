const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const router = express.Router();
const userController = require("../controller/user.controller");


// router.post('/send-otp', otpController.sendOTP);
router.get("/user_profile", authenticate, userController.user_profile);
router.get("/get_customers", authenticate, userController.get_customers);
router.post("/update_user", authenticate, userController.update_user_info);


module.exports = router;