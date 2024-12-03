const { Subscription, Streets } = require("../../tix86_subscription/models");
const { User, OTP, Role, BlackListToken } = require("../models/index");

exports.user_profile = async (req, res) => {
    try {
        let { email } = req.query;
        let user = await User.findOne({ 
            attributes:['id', 'email', 'phone_number','is_verified', 'is_subscribed', 'notification_disabled'],
            where:{ email },
            include: [
                { model: Streets, as: 'streets' },
                { model: Role, as: 'roles' },
                { model: Subscription, as:'subscription'}
            ]
        });

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


exports.update_user_info = async(req, res) => {
    try {
        let user = await User.findOne({ 
            where:{ email }
        });

        await user.update({...req.body});
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.get_customers = async (req, res) => {
    try {
        let { search } = req.query;
         // where:{ email },
        let customers = await User.findAll({ 
            attributes:['id', 'email', 'phone_number','is_verified', 'is_subscribed', 'notification_disabled'],
            include: [
                { model: Streets, as: 'streets' },
                { model: Role, as: 'roles' },
                { model: Subscription, as:'subscription'}
            ]
        });

        res.status(200).send({customers});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}