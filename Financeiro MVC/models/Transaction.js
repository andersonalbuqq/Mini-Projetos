const { DataTypes } = require('sequelize')

const Account = require('./Account')
const User = require('./User')
const db = require('../db/conn')

const Transaction = db.define('Transaction', {
    type:{
        type: DataTypes.STRING,
        required: true,
    },
    description:{
        type: DataTypes.STRING,
        required: true,
    },
    date:{
        type: DataTypes.DATE,
        required: true,
    },
    value:{
        type: DataTypes.DOUBLE,
        required: true,
    },
})

Transaction.belongsTo(Account)
Account.hasMany(Transaction)

Transaction.belongsTo(User)
User.hasMany(Transaction)

module.exports = Transaction