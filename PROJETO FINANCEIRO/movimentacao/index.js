const express = require('express')
const router = express.Router()
const path = require('path')

const pool = require('../bd/conn')

const basePath = path.join(__dirname, '../views')

router.use(
    express.urlencoded({
        extended: true
    })
)
router.use(express.json())

function formatarData(data) {
    formatado = data.split("T")[0]
    formatado = formatado.split("-")
    const dia = formatado[2]
    const mes = formatado[1]
    const ano = formatado[0]

    return `${dia}/${mes}/${ano}`
}

router.get('/historico', (req, res) => {

    const sql = "SELECT m.id_mov ,m.periodo, m.descricao, m.valor, m.tipo, c.nome FROM movimentacao m INNER JOIN contas c ON m.fk_id_conta = c.id_conta ORDER BY periodo"

    pool.query(sql, function (err, data) {
        if (err) {
            console.log(err)
            return
        }

        const info = JSON.parse(JSON.stringify(data))

        info.forEach(element => {
            element.periodo = formatarData(element.periodo)
            element.entrada = element.tipo === 'E' ? true : false;

            element.valor = element.valor.toFixed([2])
        });

        res.render(`${basePath}/historico`, {
            info
        })
    })

})

router.get('/insuficiente', (req, res) => {
    res.render(`${basePath}/insuficiente`)
})

router.get('/cadastrar', (req, res) => {

    const sql = `SELECT * FROM contas`

    pool.query(sql, function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const contas = JSON.parse(JSON.stringify(data))

        res.render(`${basePath}/cadastro`,{contas})
    })
})

router.get('/detalhe/:id', (req, res) => {

    const id = req.params.id
    const sql = `SELECT * FROM movimentacao m INNER JOIN contas c ON m.fk_id_conta= c.id_conta WHERE m.id_mov = ${id}`

    pool.query(sql, function (err, data) {
        if (err) {
            console.log(err)
            return
        }

        const info = JSON.parse(JSON.stringify(data))[0]

        info.periodo = formatarData(info.periodo)
        info.valor = info.valor.toFixed([2])
        info.mov = info.tipo === 'E' ? "Entrada" : "Saída";
        res.render(`${basePath}/detalhe`, {
            info
        })
    })

})

router.post('/cadastro', (req, res) => {

    const periodo = req.body.data
    const descricao = req.body.descricao
    const valor = req.body.valor
    const tipo = req.body.tipo
    const fk_id_conta = req.body.conta

    const sqlSd = `SELECT saldo FROM contas WHERE id_conta=?`
    const dadosSd = [fk_id_conta]
    pool.query(sqlSd, dadosSd, function (err, data) {
        if (err) {
            console.log(err)
            return
        }

        const saldo = JSON.parse(JSON.stringify(data[0].saldo))
        let novoSaldo
        if (tipo === "E") {
            novoSaldo = saldo + parseFloat(valor)
        } else if (tipo === "S") {
            novoSaldo = saldo - parseFloat(valor)
        }

        if (novoSaldo < 0) {
            res.redirect('/movimentacao/insuficiente')
            return
        } else {

            const sqlUpSd = `UPDATE contas SET saldo = ${novoSaldo} WHERE id_conta = ${fk_id_conta}`
            pool.query(sqlUpSd, function (err) {
                if (err) {
                    console.log(err)
                    return
                } else {
                    const sqlMov = `INSERT INTO movimentacao (??,??,??,??,??) VALUES (?,?,?,?,?)`
                    const dadosMov = ['periodo', 'descricao', 'valor', 'tipo', 'fk_id_conta', periodo, descricao, valor, tipo, fk_id_conta]

                    pool.query(sqlMov, dadosMov, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }
                    })
                    res.redirect('/movimentacao/historico')
                }
            })
        }
    })
})

router.post('/excluir', (req, res) => {

    const id_mov = req.body.id_mov
    const sqlMov = `SELECT * FROM movimentacao WHERE id_mov = ${id_mov}`

    pool.query(sqlMov, function (err, dataMov) {
        if (err) {
            console.log(err)
            return
        } else {

            const objMov = JSON.parse(JSON.stringify(dataMov))[0]
            const sqlSd = `SELECT saldo FROM contas WHERE id_conta = ${objMov.fk_id_conta}`

            pool.query(sqlSd, function (err, dataSd) {
                if (err) {
                    console.log(err)
                    return
                } else {
                    let valor = objMov.valor
                    const tipo = objMov.tipo
                    const saldo = JSON.parse(JSON.stringify(dataSd[0].saldo))
                    let novoSaldo

                    if (tipo === "E") {
                        novoSaldo = saldo - parseFloat(valor)
                    } else if (tipo === "S") {
                        novoSaldo = saldo + parseFloat(valor)
                    }

                    const sqlUpSd = `UPDATE contas SET saldo = ${novoSaldo} WHERE id_conta = ${objMov.fk_id_conta}`
                    pool.query(sqlUpSd, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        } else {
                            const sqlDel = `DELETE FROM movimentacao WHERE id_mov = ${objMov.id_mov}`

                            pool.query(sqlDel, function (err) {
                                if (err) {
                                    console.log(err)
                                    return
                                } else {
                                    res.redirect('/movimentacao/historico')
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post('/editar', (req, res) => {

    const id_mov = req.body.id_mov
    const sqlMov = `SELECT * FROM movimentacao WHERE id_mov = ${id_mov}`

    pool.query(sqlMov, function (err, dataMov) {
        if (err) {
            console.log(err)
            return
        } else {
            const objMov = JSON.parse(JSON.stringify(dataMov))[0]
            objMov.periodo = objMov.periodo.split("T")[0]
            objMov.entrada = objMov.tipo === 'E' ? true : false;

            const sqlContas = `SELECT * FROM contas`

            pool.query(sqlContas, function (err, dataCont) {
                if (err) {
                    console.log(err)
                    return
                }
                const contas = JSON.parse(JSON.stringify(dataCont))
                res.render(`${basePath}/editar`, {
                    mov: objMov,
                    contas
                })
            })

        }
    })
})

router.post('/alterar', (req, res) => {

    const id_mov = req.body.id_mov
    const dataNova = req.body.data
    const descricaoNova = req.body.descricao
    const valorNovo = parseFloat(req.body.valor)
    const tipoNovo = req.body.tipo
    const contaNova = req.body.conta

    const sqlMovAnt = `SELECT * FROM movimentacao WHERE id_mov = ${id_mov}`

    pool.query(sqlMovAnt, function (err, dadosAnt) {
        if (err) {
            console.log(err)
            return
        } else {
            dadosAnt = JSON.parse(JSON.stringify(dadosAnt))[0]

            const valorAnt = dadosAnt.valor
            const tipoAnt = dadosAnt.tipo
            const contaAnt = dadosAnt.fk_id_conta
            
            if (
                (valorAnt != valorNovo )||
                (tipoAnt != tipoNovo) ||
                (contaAnt != contaNova)
            ) {
                const sqlConta = `SELECT * FROM contas WHERE id_conta = ${contaAnt}`
                pool.query(sqlConta, function (err, dadosConta) {
                    if (err) {
                        console.log(err)
                        return
                    } else {
                        dadosConta = JSON.parse(JSON.stringify(dadosConta))[0]
                        let saldoNovo
                        if (tipoAnt == "E") {
                            saldoNovo = dadosConta.saldo - valorAnt
                        } else {
                            saldoNovo = dadosConta.saldo + valorAnt
                        }
                        
                        const sqlDesfaz = `UPDATE contas SET saldo = ${saldoNovo} WHERE id_conta = ${contaAnt}`
                        
                        pool.query(sqlDesfaz, function (err) {
                            if (err) {
                                console.log(err)
                                return
                            } else {

                                const sqlContaNova = `SELECT * FROM contas WHERE id_conta = ${contaNova}`

                                pool.query(sqlContaNova, function(err, dadosContaCorreta){
                                    if(err){
                                        console.log(err)
                                        return
                                    } else{
                                        dadosContaCorreta = JSON.parse(JSON.stringify(dadosContaCorreta))[0]
                                        saldoNovo = 0
                                        if (tipoNovo == "E") {
                                            saldoNovo = dadosContaCorreta.saldo + valorNovo
                                        } else {
                                            saldoNovo = dadosContaCorreta.saldo - valorNovo
                                        }
                                        const sqlDesfaz = `UPDATE contas SET saldo = ${saldoNovo} WHERE id_conta = ${contaNova}`

                                        pool.query(sqlDesfaz, function(err){
                                            if(err){
                                                console.log(err)
                                                return
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
    const sql = 'UPDATE movimentacao SET periodo = ?, descricao = ?, valor = ?, tipo = ?, fk_id_conta = ? WHERE id_mov = ?'
    const dados = [dataNova, descricaoNova, valorNovo, tipoNovo, contaNova, id_mov]

    pool.query(sql, dados, function(err){
        if(err){
            console.log(err)
            return
        } else{
            res.redirect('/movimentacao/historico')
        }
    })
})


module.exports = router