const { DataTypes } = require('sequelize')

const User = require('./User')
const db = require('../db/conn')

const Account = db.define('Account', {
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    balance:{
        type: DataTypes.DOUBLE
    }
})

Account.belongsTo(User)
User.hasMany(Account)

module.exports = Account