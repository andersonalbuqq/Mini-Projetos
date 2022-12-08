const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('financeiro2', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conexão realizada com sucesso!')
} catch (error) {
    console.log(`Não foi possível realizar a conexão: ${error}`)
}

module.exports = sequelize