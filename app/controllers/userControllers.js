const User = require('../models/user')
const userControllers = {}

userControllers.register = (req,res) => {
    const { body } = req
    const user = new User(body)
    user.save((err,user) => {
        if(err) throw err
        if(user){
            res.json(user)
        }
    })
}

userControllers.getUserChat = (req,res) => {
    const _id = req.params.id
    const info = req.params.recipient
    //const username = req.params.id
    User.findOne({_id,'inbox.info':info})
        .populate('inbox.info','username')
        .populate('inbox.chats', 'sender recipient message')
        .then(user => {
            // user.execPopulate('inbox.chats.sender','username')
            // user.execPopulate('inbox.chats.recipient','username').then(
            //     populated=>{
            //         res.json(populated.inbox[0])
            //     }
            // )
            res.json(user.inbox[0])
        })
        .catch(err => {
            res.json(err)
        })
}

module.exports = userControllers