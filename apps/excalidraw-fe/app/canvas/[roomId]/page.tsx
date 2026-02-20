"use client"
import RoomCanvas from '@/components/RoomCanvas';

export default async function page({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId


    return (
        <>
            <RoomCanvas roomId={roomId} />
        </>
    )
}
