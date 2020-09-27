import React, { useEffect, useState } from 'react'
import AgoraRTM from 'agora-rtm-sdk'
import axios from './config/axios'
import './style.css'

const client = AgoraRTM.createInstance('4b88997c353f432fbad18f5305e426a8')
const App = () => {
  const [user, setUser] = useState('5f6f7a81612ac331fc896dbc')
  const [sent, setSent] = useState('5f6f7a7b612ac331fc896dbb')
  const [msg, setMsg] = useState('')
  const [msgArray, setMsgArray] = useState([])

  const msgListener = (msg, sent) => {
    //let arr = this.msgArray
    console.log(msg, sent, '[Message received]')
    console.log(msgArray, 'client-on ARRAY')
    setMsgArray(msgArray.concat([{ sender: sent, message: msg.text }]))
    /* Your code for handling the event of receiving a peer-to-peer message. */
  }
  // console.log('[USER-CURRENT]', user)
  useEffect(() => {
    client.on(
      'MessageFromPeer',
      msgListener // text: text of the received message; peerId: User ID of the sender.
    )
    return () => {
      client.off('MessageFromPeer', msgListener)
      console.log('clean up listeners')
    }
  }, [msgArray])

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
        axios.get(`users/${user}/${sent}`)
            .then(res => {
              console.log(res.data.chats)
              setMsgArray(msgArray.concat(res.data.chats))
            })
            .catch(err => {
              console.log(err)
            })
      })
      .catch((err) => {
        console.log('AgoraRTM client login failure', err)
      })
  }

  const handleMessage = (e) => {
    e.preventDefault()
    client
      .sendMessageToPeer(
        { text: msg, userName: user }, // An RtmMessage object.
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
        <input
          type='text'
          value={sent}
          onChange={(e) => {
            setSent(e.target.value)
          }}
        />
        <input type='submit' value='users set' />
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
        <input type='submit' value='sent message' />
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
        {msgArray.map((msg, i) => {
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
