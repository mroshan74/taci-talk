const { populate } = require('../models/user')
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

userControllers.getUser = (req,res) => {
    const id = req.params.id
    User.findOne({_id:id})
        .populate('inbox.info','username')
        .populate('inbox.chats', 'sender recipient message')
        .then(user => {
            user.execPopulate('inbox.chats.sender','username')
            user.execPopulate('inbox.chats.recipient','username').then(
                populated=>{

                    res.json(populated)
                }
            )
        })
        .catch(err => {
            res.json(err)
        })
}

module.exports = userControllers