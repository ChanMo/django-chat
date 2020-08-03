import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import { host } from '../../utils/jfetch.js'

const useStyles = makeStyles(theme => ({
  item: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    '&$selected': {
      borderColor: '#33d9b2',
      backgroundColor: 'white',
    }
  },
  selected: {},
}))

const RoomList = ({data, active, onChangeActive}) => {
  const classes = useStyles()
  const handleClick = (e, room) => {
    e.preventDefault()
    onChangeActive(room)
  }

  return (
    <List>
      {data && data.map(row => (
        <ListItem
          classes={{
            root:classes.item,
            selected:classes.selected,
          }}
          button
          key={row.uuid}
          selected={active === row.uuid}
          onClick={e=>handleClick(e, row.uuid)}>
          <ListItemAvatar>
            <Badge color="secondary" variant="dot" invisible={row.unread <= 0 || active === row.uuid}>
              <Avatar src={host + row.users[1].avatar} />
            </Badge>
          </ListItemAvatar>
          <ListItemText primary={row.users[1].username} secondary={row.last_message} />
          <ListItemSecondaryAction>
            <Typography variant="body2">{moment(row.updated).fromNow()}</Typography>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default RoomList
