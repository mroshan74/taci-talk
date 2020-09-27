const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/userControllers')
const chatController = require('../app/controllers/chatControllers')

router.get('/users/:id/:recipient', userController.getUserChat)
router.post('/users/register', userController.register)


router.post('/users/sendMsg', chatController.sendChat)

module.exports = router