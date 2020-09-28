import React, { useEffect, useRef, useState } from 'react'
import AgoraRTM from 'agora-rtm-sdk'
import axios from './config/axios'
import './style.css'

const client = AgoraRTM.createInstance('4b88997c353f432fbad18f5305e426a8')
const App = () => {
  const [user, setUser] = useState('5f717a445905f016505723e7')
  const [sent, setSent] = useState('5f717a4d5905f016505723e8')
  const [msg, setMsg] = useState('')
  const [groupId, setGroupId] = useState('5f719c1288ffae5d30cf0253')
  const [msgArray, setMsgArray] = useState([])
  const [channelMsg, setChannelMsg] = useState('')
  const global = useRef()
  

  const msgListener = (msg, sent) => {
    /* Your code for handling the event of receiving a peer-to-peer message. */
    //{ msg } text of the received message; peerId: User ID of the sender.
    console.log(msg, sent, '[Message received]')
    console.log(msgArray, 'client-on ARRAY')
    setMsgArray(msgArray.concat([{ sender: sent, message: msg.text }]))
  }
  // console.log('[USER-CURRENT]', user)
  useEffect(() => {
    client.on('MessageFromPeer', msgListener)
    return () => {
      client.off('MessageFromPeer', msgListener)
      console.log('clean up listener')
    }
  }, [msgArray])

  const channelListener = (msg, senderId) => {
    // text: text of the received channel message; senderId: user ID of the sender.
      /* Your code for handling events, such as receiving a channel message. */
    console.log(msg, senderId, '[Channel Message received]')
    console.log(msgArray, 'client-on ARRAY')
    setMsgArray(msgArray.concat([{ sender: senderId, message: msg.text }]))
  }

  let channel = global.current
  console.log(global.current)
  useEffect(() => {
    if(groupId){
      global.current = channel = client.createChannel(`${groupId}`)
    }
  },[groupId])

  useEffect(() => {
    channel.on('ChannelMessage', channelListener)
    return() => {
      channel.off('ChannelMessage', channelListener)
    }
  },[msgArray])

  const handleSetUsers = (e) => {
    e.preventDefault()
    client.on('ConnectionStateChanged', (newState, reason) => {
      console.log(
        'on connection state changed to ' + newState + ' reason: ' + reason
      )
    })
    client
      .login({ token: null, uid: user })
      .then(() => {
        console.log('AgoraRTM client login success')
      })
      .catch((err) => {
        console.log('AgoraRTM client login failure', err)
      })
  }

  const handleSetSender = (e) => {
    e.preventDefault()
    channel.leave()
    axios.get(`users/${user}/${sent}`)
      .then(res => {
        console.log(res.data.chats)
        setMsgArray(msgArray.concat(res.data.chats))
      })
      .catch(err => {
        console.log(err)
    })
  }

  const handleSetChannel = (e) => {
    e.preventDefault()
    setMsgArray([])
    channel.join().then(() => {
      /* Your code for handling the event of a join-channel success. */
      console.log('joined channel')
      axios.get(`/users/chats/group/${groupId}`)
        .then(res => {
          console.log(res.data.inbox)
        setMsgArray(msgArray.concat(res.data.inbox))
        })
      }).catch(error => {
      /* Your code for handling the event of a join-channel failure. */
      console.log('channel error')
      })
  }

  const handleMessage = (e) => {
    e.preventDefault()
    client
      .sendMessageToPeer(
        { text: msg }, // An RtmMessage object.
        sent // The user ID of the remote user.
      )
      .then((sendResult) => {
        console.log(sendResult.hasPeerReceived, 'show something')
        if (sendResult.hasPeerReceived) {
          console.log(sendResult.hasPeerReceived, 'sent msg')
          /* Your code for handling the event that the remote user receives the message. */
          setMsg('')
          setMsgArray(msgArray.concat({ sender: user, message: msg }))
          axios.post('/users/sendMsg',{
            sender: user,
            recipient: sent,
            message: msg
          })
            .then(res => {
              console.log(res.data)
            })
            .catch(err => console.log(err))
        } else {
          /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
        }
      })
      .catch((error) => {
        /* Your code for handling the event of a message send failure. */
      })
  }

  const handleChannelMsg = (e) => {
    e.preventDefault()
    console.log(channelMsg, channel)
    channel.sendMessage({ text: channelMsg }).then(() => {
      /* Your code for handling events, such as a channel message-send success. */
      console.log('success channel msg', channelMsg)
      axios.post(`/users/group/sendMsg/${groupId}`,{
        sender: user,
        message: channelMsg
      })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
      setMsgArray(msgArray.concat({ sender: user, message: channelMsg }))
      setChannelMsg('')
      }).catch(error => {
      /* Your code for handling events, such as a channel message-send failure. */
      console.log('error channel msg',error)
      })
  }

  const form = () => (
    <div>

      <form onSubmit={handleSetUsers}>
        <h2>Set Users</h2>
        <input
          type='text'
          value={user}
          onChange={(e) => {
            setUser(e.target.value)
          }}
        />
        <input type='submit' value='Login' />
      </form>

      <form onSubmit={handleSetSender}>
        <h2>Set sender</h2>
        <input
          type='text'
          value={sent}
          onChange={(e) => {
            setSent(e.target.value)
          }}
        />
        <input type='submit' value='Send to' />
      </form>

      <form onSubmit={handleSetChannel}>
        <h2>Set Group id</h2>
          <input
            type='text'
            value={groupId}
            onChange={(e) => {
              setGroupId(e.target.value)
            }}
          />
          <input type='submit' value='Set group' />
      </form>

      <form onSubmit={handleMessage}>
        <h2>Message</h2>
        <input
          type='text'
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value)
          }}
        />
        <input type='submit' value='sent DM' />
      </form>

      <form onSubmit={handleChannelMsg}>
        <h2>Group Msg</h2>
        <input
          type='text'
          value={channelMsg}
          onChange={(e) => {
            setChannelMsg(e.target.value)
          }}
        />
        <input type='submit' value='sent group' disabled={groupId ? false: true}/>
      </form>

    </div>
  )
  useEffect(() => {
    console.log('[MsgArray]', msgArray)
  }, [msgArray])

  return (
    <div >
      {form()}
      <div className={'msg-container'}>
        {msgArray.length > 0 && msgArray.map((msg, i) => {
          let myMsg = `otherMsg`
          if(msg.sender == user) myMsg = 'ownMsg'
          let pos = 'other'
          if(msg.sender == user) pos = 'own'
          return (
            <div key={i} className={`msg-box ${pos}`}>
              <p >
                <span style={{ color: 'red' }}>{msg.sender}: &nbsp;</span>
                <span className={`${myMsg}`}>{msg.message}</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
