import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded.userId) return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const newUser: User = {
    ws,
    rooms: [],
    userId,
  };

  users.push(newUser);

  console.log("User connected:", userId);

  ws.on("message", async (data) => {
    try {
      const parsedData =
        typeof data === "string"
          ? JSON.parse(data)
          : JSON.parse(data.toString());

      console.log("Message received:", parsedData);

      if (parsedData.type === "join_room") {
        const roomId = String(parsedData.roomId);

        if (!newUser.rooms.includes(roomId)) {
          newUser.rooms.push(roomId);
        }

        return;
      }

      if (parsedData.type === "leave_room") {
        const roomId = String(parsedData.roomId);

        newUser.rooms = newUser.rooms.filter(
          (room) => room !== roomId
        );

        return;
      }

      if (parsedData.type === "chat") {
        const roomId = String(parsedData.roomId);
        const message = parsedData.message;

        await prisma.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
                sender: userId,
              })
            );
          }
        });

        return;
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  });


  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log("User disconnected:", userId);
  });
});