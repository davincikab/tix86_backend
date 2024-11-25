module.exports = function(sequelize, DataTypes) {
    const Subscription = sequelize.define("subscription", {
        subscription_id:{
            field:'subscription_id', 
            type:DataTypes.STRING,
            unique:true
        },
        text_notification:{
            field:'text_notication', 
            type:DataTypes.BOOLEAN,
            unique:false 
        },
        email_notification:{
            field:'email_notification', 
            unique:false,
            type:DataTypes.BOOLEAN
        },
        twelve_hours:{
            field:'twelve_hours', 
            unique:false,
            type:DataTypes.BOOLEAN
        },
        one_hour:{
            field:'one_hour', 
            unique:false,
            type:DataTypes.BOOLEAN
        },
        is_active:{
            field:'is_active', 
            unique:false,
            type:DataTypes.BOOLEAN
        },
        subscription_date:{
            field:'subscription_date',
            type:DataTypes.DATE,
        },
        subscription_duration:{
            field:'subscription_duration', 
            unique:false,
            type:DataTypes.TINYINT
        },
        expires_on:{
            field:'expires_on',
            type:DataTypes.DATE,
        }
    });

    return Subscription;
}


//  ONE USER ONE SUBSCRIPTION