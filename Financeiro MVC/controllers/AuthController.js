const User = require('../models/User')
const Account = require('../models/Account')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{
    static login(req, res){
        res.render('auth/login', {layout: 'auth'})
    }

    static async loginPost(req, res){
        const {email, password} = req.body

        //validation
        const user = await User.findOne({where: {email: email}})
        if(!user){
            req.flash('emailNotFind', "Email não registrado")
            res.render('auth/login', {layout: 'auth'}) 
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch){
            req.flash('wrongPassword', 'Senha incorreta!')
            res.render('auth/login', {layout: 'auth'}) 
            return
        }

        //initialize session
        req.session.userid = user.id
        req.session.save(() => {
            res.redirect('/home')
        })
    }

    static async logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }

    static register(req, res){
        res.render('auth/register', {layout: 'auth'})
    }

    static async createregister(req, res){
        const {name, email, password, passwordConfirm} = req.body

        //validations
        if(password !== passwordConfirm){
            req.flash('passwordErr', "As senhas informadas não conferem!")
            res.redirect('/register')
            return
        }

        const checkIfUserExists = await User.findOne({where: {email: email}})
        if(checkIfUserExists){
            req.flash('emailErr', "O email informado esta em uso!")
            res.redirect('/register')
            return
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            
            const createdUser = await User.create(user)

            //initial accounts
            const checkingAccount = {
                name: "Conta Corrente",
                balance: 0,
                UserId: createdUser.id,
            }

            const cash = {
                name: "Espécie",
                balance: 0,
                UserId: createdUser.id,
            }

            const savingsAccount = {
                name: "Poupança",
                balance: 0,
                UserId: createdUser.id,
            }

            //Initialize session
            req.session.userid = createdUser.id

            await Account.create(checkingAccount)
            await Account.create(savingsAccount)
            await Account.create(cash)

            req.session.save(() => {
                res.redirect('/home')
            })

        } catch (error) {
            console.log(error)
        }
    }
}