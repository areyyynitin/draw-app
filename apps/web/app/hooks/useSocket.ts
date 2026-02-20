import React, { useEffect, useState } from 'react'
import { WS_URL } from '../room/config'

export function useSocket() {
    const [loading,setLoading] = useState(true)
    const [socket,setSocket] = useState<WebSocket>()

    useEffect( () => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOWMyZmNmZi01Yjc5LTQwZGUtYTg1ZS0xNGRjMTg0M2E4OGIiLCJpYXQiOjE3NzE0MTg4NDAsImV4cCI6MTc3MjAyMzY0MH0.8QArDAi9CP5qaLlYKQOR7J-55mqz3iasz0AVx5Jalsg`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws)
        }
    },[] )

  return {
    socket,
    loading
  }
}
