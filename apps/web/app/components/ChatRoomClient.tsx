"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({ messages, id }: { messages: { message: string }[], id: string }) {
    const { socket, loading } = useSocket()
    const [chats, setChats] = useState(messages)
    const [currentMessage, setCurrentMessage] = useState("")

    useEffect(() => {
        if (socket && !loading) {

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                if (parsedData.type === "chat") {
                    setChats(c => [...c, { message: parsedData.message }])
                }
            }
        }
    }, [socket, loading, id])

    return (
           <>
  <div className="chatContainer">
    <div className="messages">
      {chats.map((m, index) => (
        <div key={index} className="messageBubble">
          {m.message}
        </div>
      ))}
    </div>

    <div className="inputArea">
      <input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="input"
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentMessage.trim()) {
            socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              })
            );
            setCurrentMessage("");
          }
        }}
      />

      <button
        onClick={() => {
          if (!currentMessage.trim()) return;

          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
        className="button"
      >
        Send
      </button>
    </div>
  </div>

  <style jsx>{`
    .chatContainer {
      display: flex;
      flex-direction: column;
      height: 500px;
      max-width: 500px;
      margin: 40px auto;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      background: #ffffff;
      overflow: hidden;
    }

    .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f4f6f8;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .messageBubble {
      background: #4f46e5;
      color: white;
      padding: 10px 14px;
      border-radius: 18px;
      max-width: 75%;
      width: fit-content;
      font-size: 14px;
    }

    .inputArea {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #eee;
      background: #ffffff;
    }

    .input {
      flex: 1;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 14px;
      outline: none;
    }

    .input:focus {
      border-color: #4f46e5;
    }

    .button {
      padding: 10px 16px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s ease;
    }

    .button:hover {
      background: #4338ca;
    }
  `}</style>

        </>
    )

}


