import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import ProductCard from '../../ecommerce/components/product_card.js'
import { host } from '../../utils/jfetch.js'
import styled from 'styled-components'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    flexDirection: props => props.direction === 'left' ? 'row' : 'row-reverse'
  },
  text: {
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid rgba(0,0,0,0.04)',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  time: {
    textAlign: props => props.direction,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  modal: {
  },
  fullimg: {
    maxWidth: '100%'
  }
}))

const MessageBox = (props) => {
  const {data, direction, ...other} = props
  const classes = useStyles({direction:direction})
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Box
        className={classes.root}
        {...other}>
        <Avatar src={host+data.user.avatar} />
        <Box>
          <Box className={classes.text}>
            {data.mtype === 'image' && (
              <img
                onClick={()=>setOpen(true)}
                src={`${host}${data.msg}?width=320`}
                alt={data.msg} />
            )}
            {data.mtype === 'product' && (
              <ProductCard data={data.product} />
            )}
            {data.mtype === 'text' && (
              <Typography variant="body2">{data.msg}</Typography>
            )}
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.time}
          >{moment(data.created).format("MM/DD hh:mm")}</Typography>
        </Box>
      </Box>
      {data.mtype === 'image' && (
        <Dialog
          open={open}
          maxWidth={false}
          onClose={handleClose}
          className={classes.modal}
          aria-labelledby="lightbox">
          <img
            className={classes.fullimg}
            src={host+data.msg}
            alt={data.msg}
            onClick={handleClose} />
        </Dialog>
      )}
    </React.Fragment>
  )
}

export default MessageBox
