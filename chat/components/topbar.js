import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.08)'
  },
  title: {
    flex: 1
  }
}))

const TopBar = ({me, room}) => {
  const classes = useStyles()
  const user = room.users.find(i => i.id !== me) // other user
  return (
    <AppBar color="white" position="static" className={classes.root}>
      <Toolbar>
        {/*<Avatar src={user.avatar} />*/}
        <Typography variant="h6" className={classes.title}>{user.username}</Typography>
        {room && (
          <IconButton color="inherit" href={`/admin/chat/room/${room.uuid}/delete/`}>
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
