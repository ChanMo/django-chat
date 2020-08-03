import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import MessageBox from './message_box'
import { makeStyles } from '@material-ui/core/styles'
import InputBox from './input_box'
import TopBar from './topbar.js'
import jfetch, {host} from '../../utils/jfetch'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  container: {
    padding: theme.spacing(2),
    overflowY: 'scroll',
    flex: 1
  },
  action: {
    height: '3.5rem'
  }
}))

const Room = (props) => {
  const [data, setData] = useState({count:0, results:[]})
  const classes = useStyles()
  const ws = useRef(null)
  const [offset, setOffset] = useState(0)
  const limit = 10
  const { id, user, room, premsg } = props

  if(!id) {
    return null
  }

  useEffect(()=>{
    const ele = document.getElementById('message-container')
    const height = ele.scrollHeight - ele.clientHeight
    //ele.scroll({top:height, behavior:'smooth'})
    ele.scroll({top:height})
  }, [data])

  useEffect(()=>{
    const fetchData = async () => {
      const url = `/api/chat/message/?uuid=${id}&offset=0&limit=${limit}`
      try {
        const res = await jfetch(url)
        setData({count:res.count, results:res.results.reverse()})
      } catch(error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id])

  useEffect(()=>{
    const domain = process.env.STORYBOOK ? process.env.DOMAIN : window.location.host
    //const token = 'Bearer ' + btoa('chen:mdian1927')
    //ws.current = new WebSocket(`ws://${token}@192.168.0.186:8000/ws/chat/`)
    ws.current = new WebSocket(`ws://${domain}/ws/chat/${id}/`)
    ws.current.onopen = () => {
      console.log('ws opened')
      if(premsg) {
        handleSend(premsg)
      }
    }
    ws.current.onclose = () => console.log('ws closeed')
    ws.current.onmessage = e => {
      const message = JSON.parse(e.data)
      //setMsgs(msgs => [...msgs, message])
      setData(data => ({...data, count:data.count+1, results:[...data.results, message]}))
    }
    return () => {
      ws.current.close()
    }
  }, [id])

  useEffect(()=>{
    if(ws.current.readyState === WebSocket.OPEN && premsg) {
      handleSend(premsg)
    }
  }, [premsg])

  const handleSend = (message) => {
    console.log(message)
    ws.current.send(JSON.stringify({
      ...message,
      'user': user,
    }))
  }

  return (
    <Box className={classes.root}>
      {room && (
        <TopBar me={user} room={room} />
      )}
      <Box id="message-container" className={classes.container}>
        {data.results.map((msg,index) => (
          <MessageBox
            key={index}
            data={msg}
            direction={msg.user.id == user ? 'right' : 'left'}
          />
        ))}
      </Box>
      <Box className={classes.action}>
        <InputBox onSubmit={handleSend} />
      </Box>
    </Box>
  )
}

export default Room

if(document && document.getElementById('root')) {
  ReactDOM.render(<Room {...window.props} />, document.getElementById('root'))
}
