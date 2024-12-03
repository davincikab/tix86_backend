const express = require('express');
const controller = require('./controller/index');

const { authenticate } = require('../../middlewares/authenticate');
const { validate, couponcodeValidator, validateCouponCode } = require('../../middlewares/validateSchema');
const { checkSchema } = require('express-validator');
const router = express.Router();


router.post("/update_streets", authenticate, controller.update_streets);
router.post("/update_subscription", authenticate, controller.update_subscription);


// coupons code routes
router.get("/coupon_codes", authenticate, controller.getCouponCodes);
router.get("/coupon_codes_filter", authenticate, controller.getCouponCodesByCode);

router.post("/coupon_codes/add", authenticate, validate([checkSchema(couponcodeValidator)]), controller.addCouponCodes);
router.delete("/coupon_codes/delete/:code", authenticate, controller.deleteCouponCodes);
router.post("/activate_subscription_by_couponcode", authenticate, validate([validateCouponCode]), controller.activateSubscriptionByCouponCode)

router.post("/process_subscription_payment", authenticate, controller.processSubscriptionPayment)
module.exports = router;