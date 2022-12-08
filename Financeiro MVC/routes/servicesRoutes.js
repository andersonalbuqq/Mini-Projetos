const express = require('express')
const router = express.Router()

const ServicesController = require('../controllers/ServicesController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/home', checkAuth, ServicesController.home) 
router.get('/transaction', checkAuth, ServicesController.transaction) 
router.post('/transaction', checkAuth, ServicesController.createtransaction)
router.get('/historic', checkAuth, ServicesController.historic) 

module.exports = router