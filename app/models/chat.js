const mongoose = require('mongoose')

const Schema = mongoose.Schema
const chatSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String
        },
        msgType: {
            type: String,
            default: 'text'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
)

const Chat = mongoose.model('Chat', chatSchema)
module.exports = { Chat, chatSchema }