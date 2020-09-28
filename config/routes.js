const express = require('express')
const router = express.Router()

const userControllers = require('../app/controllers/userControllers')
const chatControllers = require('../app/controllers/chatControllers')

router.get('/users/:id/:recipient', userControllers.getUserChat)
router.post('/users/register', userControllers.register)


router.post('/users/create/group',chatControllers.createGroup)
router.get('/users/chats/group/:groupId',chatControllers.getGroupChat)
router.post('/users/sendMsg', chatControllers.sendChat)
router.post('/users/group/sendMsg/:groupId', chatControllers.groupChat)

module.exports = router