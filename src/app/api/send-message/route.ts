import { generateToken } from "@/src/helpers/jwt";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import MessageModel from "../../../model/MessageModel";

import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";
import ChatModel from "@/src/model/ChatModel";



export const POST = async (request: NextRequest) => {
    await dbConnect()

    const { chatId, senderId, messageContent } = await request.json()
    console.log(chatId, senderId, messageContent);
    try {

        const chat = await ChatModel.findById(chatId)
        console.log(chat);
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

        console.log("newMessage", newMessage);


        return Response.json(
            {
                success: true,
                message: "Message Sent Successfully",
                latestSentMessage: newMessage,
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

