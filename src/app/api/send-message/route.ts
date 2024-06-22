import dbConnect from "../../../lib/dbConnect";
import MessageModel from "../../../model/MessageModel";

import { NextRequest, NextResponse } from "next/server";
import ChatModel from "@/src/model/ChatModel";
import pusher from '@/src/lib/pusher'

export const POST = async (request: NextRequest) => {
    await dbConnect()

    const { chatId, senderId, messageContent } = await request.json()
    try {
        const chat = await ChatModel.findById(chatId)
        if (!chat) {
            return Response.json(
                {
                    success: false,
                    message: "Chat Not Found"
                },
                { status: 404 }
            )
        }

        const newMessage = await MessageModel.create({
            sender: senderId,
            content: String(messageContent),
            chat: chat._id,
            readBy: []
        })

        await newMessage.save()

        chat.messages.push(newMessage._id)
        await chat.save()
        // console.log("chat", chat);

        const pusherResponse = await pusher.trigger(`chat-${chatId}`, 'message', {
            chatId,
            senderId,
            content: messageContent,
            sender: { _id: senderId },
        });
        console.log("pusherResponse:: ", pusherResponse);
        


        // console.log("newMessage", newMessage);

        return Response.json(
            {
                success: true,
                message: "Message Sent Successfully",
                chat: chat
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Sending Message", error);
        return Response.json(
            {
                success: false,
                message: "Error Sending Message"
            },
            { status: 500 }
        )
    }

}

