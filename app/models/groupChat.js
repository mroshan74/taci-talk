const mongoose = require('mongoose')

const Schema = mongoose.Schema
const groupChatSchema = new Schema(
    {   
        groupName: {
            type: String,
        },
        createdBy: {
            type: String,
        },
        createdOn: {
            type: String,
            default: Date.now
        },
        groupType: {
            type: String,
            default: 'public'
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        inbox: [{
            sender: {
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
            createdOn: {
                type: Date,
                default: Date.now()
            }
        }]
    },
    { timestamps: true }
)

const GroupChat = mongoose.model('GroupChat', groupChatSchema)
module.exports = { GroupChat, groupChatSchema }