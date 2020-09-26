const User = require('../models/user')
const { Chat } = require('../models/chat')
const chatControllers = {}

chatControllers.sendChat = async (req,res) => {
    const { body } = req
    try{
        const chat = new Chat(body)
        const getChat =  await chat.save()
        // console.log(getChat)
        
        if(getChat){
            //! SENDER
            User.findOne({
                _id: body.sender,
                'inbox.info': body.recipient
            })
            .then(chat => {
                console.log(chat)
                if(!chat){
                    console.log('no chat')
                    User.findByIdAndUpdate({_id: body.sender},{
                        $push: {
                            inbox: { 
                                info: body.recipient,
                                chats: getChat._id
                            }
                        }
                    },{new:true})
                    .then()
                    .catch(err => {
                        res.status(502).json({
                            ok: false,
                            err
                        })
                    })
                }else{
                    User.findOneAndUpdate({ 
                        _id: body.sender,
                        'inbox.info': body.recipient,
                    },{
                        $push: {
                            'inbox.$.chats': getChat._id
                        }
                    },{
                        new: true
                    })
                    .then(chat => res.json(chat))
                    res.status(502).json({
                        ok: false,
                        err
                    })
                }
            })

            //! RECEIVER
            User.findOne({
                _id: body.recipient,
                'inbox.info': body.sender
            })
            .then(chat => {
                console.log(chat)
                if(!chat){
                    console.log('no chat')
                    User.findByIdAndUpdate({_id: body.recipient},{
                        $push: {
                            inbox: { 
                                info: body.sender,
                                chats: getChat._id
                            }
                        }
                    },{new:true})
                    .then()
                    .catch(err=> {
                        res.status(502).json({
                            ok: false,
                            err
                        })
                    })
                }else{
                    User.findOneAndUpdate({ 
                        _id: body.recipient,
                        'inbox.info': body.sender,
                    },{
                        $push: {
                            'inbox.$.chats': getChat._id
                        }
                    },{
                        new: true
                    })
                    .then()
                    .catch(err=> {
                        res.status(502).json({
                            ok: false,
                            err
                        })
                    })
                }
            })
        }
    }catch(err){
        res.status(500).json({
            ok: false,
            err
        })
    }
}

module.exports = chatControllers