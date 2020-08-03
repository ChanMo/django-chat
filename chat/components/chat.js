import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Room from './room'
import RoomList from './room_list'
import ToolBox from './tool_box.js'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import theme from '../../themes/theme.js'
import jfetch from '../../utils/jfetch.js'

const Wrapper = styled.div`
display: flex;
height: 100%;
background: rgba(0,0,0,0.04);
`
const RoomListContainer = styled.div`
width: 420px;
padding: .5rem 1rem 0;
box-sizing: border-box;
`

const RoomContainer = styled.div`
flex: 1;
border-left: 1px solid rgba(0,0,0,0.06);
background: white;
`

const useStyles = makeStyles(theme => ({
  toolbox: {
    width: 380,
    minWidth: 380,
  }
}))

const Chat = (props) => {
  const [active, setActive] = useState(null)
  const [rooms, setRooms] = useState([])
  const [premsg, setPremsg]= useState({}) // 常用消息
  const classes = useStyles()
  const ws = useRef(null)

  useEffect(()=>{
    const domain = process.env.STORYBOOK ? process.env.DOMAIN : window.location.host
    ws.current = new WebSocket(`ws://${domain}/ws/accounts/`)
    ws.current.onopen = () => console.log('accounts ws opened')
    ws.current.onclose = () => console.log('accounts ws closeed')
    ws.current.onmessage = e => {
      const message = JSON.parse(e.data)
      setRooms(rooms => [message.room, ...rooms.filter(i=>i.uuid !== message.room.uuid)])
    }
    return () => {
      ws.current.close()
    }
  }, [])

  useEffect(()=>{
    const fetchData = async() => {
      try {
        const res = await jfetch('/api/chat/')
        setRooms(res)
        setActive(res[0].uuid)
      } catch(error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handleSendPremsg = (msg) => {
    // 发送预备消息
    setPremsg(msg)
  }


  const handleChange = (id) => {
    setActive(id)
    setPremsg({})
  }
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <RoomListContainer>
          <RoomList
            data={rooms}
            active={active}
            onChangeActive={handleChange}
          />
        </RoomListContainer>
        {active && (
          <RoomContainer>
            <Room
              id={active} // 废弃
              user={props.user}
              premsg={Object.keys(premsg).length === 0 ? undefined : premsg }
              room={rooms.find(i=>i.uuid === active)} />
          </RoomContainer>
        )}
        <ToolBox
          className={classes.toolbox}
          onChoice={handleSendPremsg} />
      </Wrapper>
    </ThemeProvider>
  )
}

export default Chat

if(document && document.getElementById('root')) {
  ReactDOM.render(<Chat {...window.props} />, document.getElementById('root'))
}
