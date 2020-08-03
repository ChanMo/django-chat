import React from 'react';
import Room from './room'
import RoomList from './room_list'
import Chat from './chat'
import MessageBox from './message_box'
import InputBox from './input_box.js'
import ToolBox from './tool_box.js'

export default {
  title: 'Chat',
};

export const base = () => (
  <Chat
    user={1}
    rooms={[{'uuid':'d97cfc6f-b264-4b91-a3a9-b994475dd434', 'name':'001'},{'uuid':'d97cfc6f-b264-4b91-a3a9-b994475dd435', 'name':'002','avatar':'/media/attachments/8d11ee37-149b-498f-91b1-fcea0fa2d2cd.jpg'}]} />
)

export const room = () => (
  <div>
    <Room
      id="d7332a6c-1315-4486-9eb2-c54eee2bc871"
      user={2}
      room={{users:[{id:1,username:'demo',avatar:'demo'}]}}
    />
  </div>
)

export const roomList = () => (
  <RoomList
    data={[{'uuid':'001','name':'001'}, {'uuid':'002', 'name':'002'}]}
    active='001'
    onChangeActive={()=>null}
  />
)

export const messageBox = () => (
  <div>
    <h3>text message</h3>
    <MessageBox data={{'msg':'test', 'user':{'avatar':'http://img3.cache.netease.com/photo/0003/2015-10-08/B5DG6K5100AJ0003.jpg'}}} />
    <h3>image message</h3>
    <MessageBox data={{'msg':'/media/attachments/40e83708-a312-451f-be05-a108d7288b5e.jpg', 'mtype':'image', 'user':{'avatar':'c'}}} />
  </div>
)

export const inputBox = () => (
  <InputBox onSubmit={()=>null} />
)

export const toolBox = () => (
  <ToolBox />
)
