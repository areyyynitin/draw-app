import { WS_URL } from '@/config';
import initDraw from '@/draw';
import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas';

export default function RoomCanvas({roomId} : {roomId:string}) {
     const [socket,setSocket] = useState<WebSocket | null>(null)

     useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOWMyZmNmZi01Yjc5LTQwZGUtYTg1ZS0xNGRjMTg0M2E4OGIiLCJpYXQiOjE3NzE0MTg4NDAsImV4cCI6MTc3MjAyMzY0MH0.8QArDAi9CP5qaLlYKQOR7J-55mqz3iasz0AVx5Jalsg`)

        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
     } , [])

     if(!socket){
        return <> <div>connecting to a server</div></>
     }




    return ( 
        <div>
           <Canvas roomId={roomId} socket={socket} />

           
        </div>
    )
}
