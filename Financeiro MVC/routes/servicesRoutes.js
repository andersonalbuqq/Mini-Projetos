const express = require('express')
const router = express.Router()

const ServicesController = require('../controllers/ServicesController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/home', checkAuth, ServicesController.home) 
router.get('/transaction', checkAuth, ServicesController.transaction) 
router.post('/transaction', checkAuth, ServicesController.createtransaction)
router.get('/details/:id', checkAuth, ServicesController.showdetails)
router.post('/delete', checkAuth, ServicesController.delete)
router.post('/edit', checkAuth, ServicesController.edit)
router.post('/update', checkAuth, ServicesController.update)
router.get('/historic', checkAuth, ServicesController.historic) 

module.exports = router