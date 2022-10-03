const express = require('express')
const exphbs = require('express-handlebars')
const hbs = exphbs.create({
    partialsDir: ['views/partials'],
})

const mov = require('./movimentacao')
const pool = require('./bd/conn')

const app = express()

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use('/movimentacao', mov)

app.get('/', (req, res) =>{

    const sql = `SELECT * FROM contas`

    pool.query(sql, function(err, dados){
        if(err){
            console.log(err)
            return
        } else{
            dados = JSON.parse(JSON.stringify(dados))

            dados.forEach(element => {
                element.saldo = element.saldo.toFixed([2])
            });

            const cc = dados[0]
            const poupanca = dados[1]
            const especie = dados[2]
            let total = parseFloat(cc.saldo) + parseFloat(poupanca.saldo) + parseFloat(especie.saldo)
            total = total.toFixed([2])
            res.render('home', {cc, poupanca, especie, total})
        }
    })
})

app.listen(3000)