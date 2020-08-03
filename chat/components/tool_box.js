import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import jfetch from '../../utils/jfetch.js'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: 'white',
  },
  title: {
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  inner: {
  }
}))

const ToolBox = (props) => {
  const {onChoice, className, ...others} = props
  const classes = useStyles()
  const [data, setData] = useState([])

  useEffect(()=>{
    const fetchData = async() => {
      try {
        const res = await jfetch('/api/chat/common_text/')
        setData(res)
      } catch(error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <Box className={[classes.root, className]} {...others}>
      <Box className={classes.inner}>
        <Typography
          variant="h6"
          component="h4"
          className={classes.title}>常用语</Typography>
        <List>
          {data.map(row => (
            <ListItem button key={row.id}
              onClick={()=>onChoice({'mtype':'text','msg':row.content})}>
              <ListItemText primary={row.content} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default ToolBox
