const { where, Op } = require("sequelize");
const { User } = require("../../users/models");
const { Streets, Subscription } = require("../models");
const  {CuoponCode} = require("../models/index");


exports.update_streets = async(req, res) => {
    try {
        let { streets, user } = req.body;
        await Streets.destroy({ where:{ userId: user.id}});

        let streetInfo = streets.map(street => {
            return {
                ...street,
                'userId':user.id,
                'name':street.name, 
                'dl1_day':street.dl1_day, 
                'dl1_time':street.dl1_time, 
                'dl2_day':street.dl2_day, 
                'dl2_time':street.dl2_time, 
                'address':street.name, 
                'bounds':street.bounds instanceof Array ? JSON.stringify(street.bounds) : street.bounds
            }
        })

        let streetUpdates = await Streets.bulkCreate(streetInfo);
        return res.status(200).send({streets:streetUpdates});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message})
    }
}


exports.update_subscription = async(req, res) => {
    try {
        // console.log(req.body);
        let { text_notification, email_notification, twelve_hours, one_hour, user } = req.body;
        let subscription = await Subscription.findOne({ where: {userId:user.id} });

        if(subscription) {
            subscription = await subscription.update({text_notification, email_notification, twelve_hours, one_hour})
        } else {
            subscription = await Subscription.create( {text_notification, email_notification, twelve_hours, one_hour, userId:user.id});
        }

        console.log(subscription);

        res.status(200).send({...subscription.toJSON()})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message})
    }
}

exports.get_user_streets = async(req, res) => {
    try {
        let { user } = req.body;
        let streets = await Streets.finAll({ where:{ userId: user.id}});
        return res.status(200).send({streets:streets.toJSON()});
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }
}

exports.delete_user_street = async(req, res) => {
    try {
        let { user, street_name } = req.body;
        let streets = await Streets.destroy({ where:{ userId: user.id, name:street_name }});
        return res.status(200).send({streets});
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }
}


exports.getCouponCodes = async(req, res) => {
    try {
        let codes = await  CuoponCode.findAll();
        res.status(200).send({codes});
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }
}

exports.getCouponCodesByCode = async(req, res) => {
    try {
        let { code } = req.query;
        let codes = await CuoponCode.findAll({ where: {
            code:{
                [Op.like]:`%${code.toLocaleUpperCase()}%`
            }
        }});

        res.status(200).send({codes});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message})
    }
}


exports.addCouponCodes = async(req, res) => {
    try {
        let { code, expires_on } = req.body;
        let couponcode = await CuoponCode.create({ code, is_active:true, expires_on });
        
        res.status(200).send({couponcode});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message})
    }
}

exports.deleteCouponCodes = async(req, res) => {
    try {
        let { code } = req.params;
        let couponcode = await CuoponCode.destroy({ where: { code }});
        
        res.status(200).send({couponcode});
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }
}

exports.activateSubscriptionByCouponCode = async(req, res) => {
    try {
        let { code, userId } = req.body;
        let couponcode = await CuoponCode.findOne({ where: { code, is_active:true }});

        if(couponcode) {
            // check expiry data
            if(new Date(couponcode.expires_on).valueOf() < new Date().valueOf() ) {
                await couponcode.update({ is_active:false })
                return res.status(500).send({error:"Code has expired "});
            }

            // update subscription
            let user_subscription = await Subscription.findOne({ where: { userId }});
            let currentDate = new Date().getDate();
            let expiryDate = new Date().setDate(currentDate + 30)

            let subscription = await user_subscription.update({
                is_active:true, 
                subscription_id:code,
                subscription_date:new Date().toISOString(), 
                expires_on:new Date(expiryDate).toISOString(),
            });

            await couponcode.update({ is_active:false });

            return res.status(200).send({ couponcode, subscription });
        } else {
            return res.status(500).send({"error":"Promo Code is not active"});
        }
        
    } catch (error) {
        return res.status(500).send({ message: error.message})
    }
}

// pass promo code
// update subscription info
exports.processSubscriptionPayment = async(req,res) => {
    try {
        let info = req.body;
        let subscription = await Subscription.findOne({ 
            where: {userId:info.userId}
        });

        // update subscription details
        await subscription.update({...info});

        return res.status(200).send("success");
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message})
    }
}