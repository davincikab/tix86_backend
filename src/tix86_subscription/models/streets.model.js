module.exports = function(sequelize, DataTypes) {
    const CouponCode = sequelize.define("streets", {
        id:{
            field:'id',
            unique:true,
            primaryKey:true,
            type:DataTypes.BIGINT,
            autoIncrement: true,
        },
        name:{
            field:'name', 
            type:DataTypes.STRING
        },
        // sweeping_info:{
        //     // days, time
        // },
        
        dl1_day:{
            field:'dl1_day',
            type:DataTypes.STRING
        }, 
        dl1_time:{
            field:'dl1_time',
            type:DataTypes.STRING
        },
        dl2_day:{
            field:'dl2_day',
            type:DataTypes.STRING
        }, 
        dl2_time:{
            field:'dl2_time',
            type:DataTypes.STRING
        },
        address:{
            field:'street_address', 
            type:DataTypes.STRING
        },
        bounds:{
            field:'bounds', 
            type:DataTypes.STRING
        }
    });

    return CouponCode;
}

// one to many relation: 1 user can subscribe to many streets