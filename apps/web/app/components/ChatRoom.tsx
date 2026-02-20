
import axios from 'axios'
import React from 'react'
import { BACKEND_URL } from '../room/config'
import { ChatRoomClient } from './ChatRoomClient'

async function getChats(roomId:any){
   const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
   return response.data.messages
}

export default async function ChatRoom({id} : {id:string}) {
    const messages = await getChats(id)
  return (
    <div>
      <ChatRoomClient  id={id} messages={messages} />
    </div>
  )
}
