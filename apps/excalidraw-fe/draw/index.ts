import { BACKEND_URL } from "@/config"
import axios from "axios"

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}



export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d")
    let existingShape: Shape[] = await getExisitingShapes(roomId)

    if (!ctx) {
        return;
    }



    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message.type == "chat") {
            const parsedShape = JSON.parse(event.data);
            existingShape.push(parsedShape.shape)
            clearCanvas(existingShape, canvas, ctx)
        }
    }

    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    clearCanvas(existingShape, canvas, ctx)
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX
        startY = e.clientY
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false
        const width = e.clientX - startX
        const height = e.clientY - startY
        const shape : Shape = {
            type: "rect",
            height: height,
            width: width,
            x: startX,
            y: startY
        }
        existingShape.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),roomId
        }))

    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            console.log("start")
            const width = e.clientX - startX
            const height = e.clientY - startY
            clearCanvas(existingShape, canvas, ctx)
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(startX, startY, width, height)

        }
        console.log("end")
    })

}


function clearCanvas(existingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    existingShape.map((shape) => {
        if (shape.type == "rect") {
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}

async function getExisitingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const messages = res.data.messages

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })
    return shapes;
}