const mongoose = require('mongoose')
//const { userSchema } =require('./chat')

const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            max: 32
        },
        inbox: [{
            info: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            chats: [{
                type: Schema.Types.ObjectId,
                ref: 'Chat'
            }]
        }]
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User