module.exports = function(sequelize, DataTypes) {
    const CouponCode = sequelize.define("coupon_code", {
        code:{
            field:'code', 
            type:DataTypes.STRING(5),
            unique:true 
        },
        is_active:{
            field:'is_active', 
            unique:false,
            type:DataTypes.BOOLEAN
        },
        expires_on:{
            field:'expires_on',
            type:DataTypes.DATE,
        }
    });

    return CouponCode;
}