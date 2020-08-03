import React, { useState } from 'react'
import { Send, Image as ImageIcon} from 'react-feather'
import styled from 'styled-components'
import jfetch, {host} from '../../utils/jfetch.js'

const Wrapper = styled.div`
  border-top: 1px solid lightgrey;
  display: flex;
  height: 3.5rem;
  align-items: center;
  padding: 0 .5rem;
  background: white;
`

const ImageInput = styled.input`
  display: none;
`

const ImageLabel = styled.label`
  border: none;
  margin-right: .5rem;
  background: transparent;
  &:focus {
    outline: none;
    background: rgba(0,0,0,0.02);
  }
`

const Input = styled.input`
  flex: 1;
  border-radius: 5px;
  border: 2px solid lightgrey;
  padding: .25rem 1rem;
  line-height: 1.75rem;
  font-size: 1.15rem;
  &:focus {
    outline: none;
    border-color: black;
  }
`

const SendButton = styled.button`
  margin-left: .5rem;
  background: transparent;
  border: none;
  &:focus {
    outline: none;
    background: rgba(0,0,0,0.06);
  }
`

const InputBox = ({onSubmit}) => {
  const [text, setText] = useState('')
  const [message, setMessage] = useState({'mtype':'text', 'msg':''})

  const handleUpload = event => {
    if(event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = async function(e) {
        try {
          const res = await jfetch('/api/attachments/', {source:e.target.result}, 'POST')
          onSubmit({'mtype':'image', 'msg':res.source})
          //setMessage({'mtype':'image', 'msg':res.source})
        } catch(error) {
          console.log(error)
        }
      }
      reader.readAsDataURL(file)
    }
  }


  const handleText = (e) => {
    const value = e.target.value
    //setText(value)
    setMessage({'mtype':'text', 'msg':value})
  }

  const handleSubmit = () => {
    //onSubmit(text)
    onSubmit(message)
    //setText('')
    setMessage({'mtype':'text','msg':''})
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Wrapper>
      <ImageInput
        type="file"
        accept="image/*"
        id="send-image"
        onChange={handleUpload} />
      <ImageLabel htmlFor="send-image">
        <ImageIcon color="grey" />
      </ImageLabel>
      <Input
        type="text"
        autoFocus
        rows={1}
        value={message.msg}
        onKeyDown={handleKeyDown}
        onChange={handleText} />
      <SendButton
        onClick={handleSubmit}>
        <Send color="grey" />
      </SendButton>
    </Wrapper>
  )
}

export default InputBox
