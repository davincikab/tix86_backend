const express = require('express');
const { body, validationResult, checkSchema } = require('express-validator');
const authController = require('../controller/auth.controller');
const { validate, registrationSchema, validateConfirmPassword } = require('../../../middlewares/validateSchema');
const { authenticate } = require('../../../middlewares/authenticate');
const router = express.Router();


router.post(
    '/signup', 
    validate([validateConfirmPassword]), 
    validate(checkSchema(registrationSchema)), 
    authController.signup
);

router.post(
    "/verification",  
    validate([
        body('email').isEmail().normalizeEmail(),
        body('otp_code').isLength({min: 6})
    ]), 
    authController.registration_verification
);

// validate( [body.email('')]),

router.post("/signin",  authController.signin);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);


router.post(
    '/change_password', 
    authenticate,
    validate([validateConfirmPassword]), 
    authController.change_password
);

router.post(
    '/send_password_reset_link', 
    authController.send_reset_password_link
);


http://localhost:3000/b8769ed67a249268fe20cd91ebcaa02c7611d3af
router.post(
    '/reset_password/:token', 
    validate([validateConfirmPassword]), 
    authController.reset_password
);

module.exports = router;