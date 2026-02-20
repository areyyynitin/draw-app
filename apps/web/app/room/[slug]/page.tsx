import axios from 'axios'
import React from 'react'
import { BACKEND_URL } from '../config'
import ChatRoom from '../../components/ChatRoom';

async function getRoomId(slug:string){
 const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
 return response.data?.room?.id ?? null;
}

export default async function ChatRoom1({params} : {params:{slug:string}}) {
  const slug = (await params).slug
  const roomId =await getRoomId(slug)
  return (
    <div>
      page

      <ChatRoom id={roomId}   />
    </div>
  )
}
