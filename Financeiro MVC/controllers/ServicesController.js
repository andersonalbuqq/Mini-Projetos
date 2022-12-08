const User = require('../models/User')
const Account = require('../models/Account')
const Transaction = require('../models/Transaction')
const { Op } = require('sequelize')

module.exports = class ServicesController{
    static async home(req, res) {

        try {
            const user = await User.findOne({where: {id: req.session.userid}})
            const accounts = await Account.findAll({where: {UserId: user.id}})
            
            let total = 0
            accounts.forEach(account => {
                account = account.get({plain: true})
                total+= account.balance
                account.balance = account.balance.toFixed([2])
            })
            
            res.render('services/home', {user, accounts, total})
        } catch (error) {
            console.log(error)
        }
    }
    
    static async transaction(req, res){
        try {
            const user = await User.findOne({where: {id: req.session.userid}})
            const accounts = await Account.findAll({where: {UserId: user.id}})
            
            res.render('services/transaction', {accounts})
        } catch (error) {
            console.log(error)
        }
    }

    static async createtransaction(req, res){
        try {
            const {date, description, value, type, accountid} = req.body
            const userId =  req.session.userid

            const account = await Account.findOne({where : {id: accountid, UserId: userId}, raw: true})
            const balance = parseFloat(account.balance)
            let newbalance

            // validation
            if(enough_balance(balance, value, type)){
                newbalance = perform_operation(balance, value, type)
            } else{
                const user = await User.findOne({where: {id: req.session.userid}})
                const accounts = await Account.findAll({where: {UserId: user.id}})
    
                req.flash('insufficient_funds', "Saldo Insuficiente")
                res.render('services/transaction', {accounts})
                return
            }

            const transaction = {
                type: type,
                description: description,
                date: date,
                value: value,
                AccountId: accountid,
                UserId: userId
            }

            const updated_account = {
                name: account.name,
                balance: newbalance,
                UserId: account.UserId
            }

            try {
                await Transaction.create(transaction)
                await Account.update(updated_account, {where: {id: account.id}})

                req.session.save(() =>{
                    res.redirect('/historic')
                })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async historic(req, res){
        try{
            let needclean = false

            //Search
            let search = ''

            if(req.query.search){
                search = req.query.search
                needclean = true
            }

            //Order
            let order = 'DESC'

            if(req.query.order === 'old'){
                order = 'ASC'
            } else {
                order = 'DESC'
            }

            const userId =  req.session.userid
            const accounts = await Account.findAll({where: {UserId: userId}})

            //Account
            let account = []
                        
            if(req.query.accountid){
                account = req.query.accountid
                needclean = true
            } else{
                accounts.forEach( element => {
                    account.push(element.id)
                })
            }
            

            let financial_transactions = await Transaction.findAll({
                where: {
                    UserId: userId,
                    description: {[Op.like]: `%${search}%`},
                    AccountId: account
                },
                include: [{
                    model: Account,
                    required: true,
                    attributes: ['name'],
                }],
                order: [['date', order]]
            })

            financial_transactions = JSON.parse(JSON.stringify(financial_transactions))

            financial_transactions.forEach( transaction => {
                transaction.date = format_date(transaction.date)
                transaction.value = transaction.value.toFixed([2])
                transaction.isentry = transaction.type === 'E' ? true : false
            })
            res.render('services/historic', {financial_transactions, needclean, accounts})   
        } catch (error) {
            console.log(error)
        }
    }
}


function enough_balance(balance, value, type){
    balance = parseFloat(balance)
    value = parseFloat(value)
    if(type === "E"){
        return true
    } else if(balance - value > 0) {
        return true
    } else{
        return false
    }
}

function perform_operation(balance, value, type){
    balance = parseFloat(balance)
    value = parseFloat(value)
    let newbalance

    if (type === "E") {
        newbalance = balance + parseFloat(value)
    } else if (type === "S") {
        newbalance = balance - parseFloat(value)
    }

    return newbalance
}

function format_date(date){
    let formatting = date.split("T")[0]
    formatting = formatting.split("-")
    const day = formatting[2]
    const month = formatting[1]
    const year = formatting[0]

    return `${day}/${month}/${year}`
}