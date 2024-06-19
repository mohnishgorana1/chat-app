import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../../model/UserModel";
import ChatModel from "@/src/model/ChatModel";
import MessageModel from "@/src/model/MessageModel";



export const POST = async (request: NextRequest) => {
    await dbConnect()
    const { userId } = await request.json()

    try {
        // console.log("fetching chats");

        const chats = await ChatModel.find({ users: userId })
            .populate('users', '-password')
            .populate('messages')

        // console.log("chats",chats);


        return Response.json(
            {
                success: true,
                message: "Chats Fetched Successfully",
                chats: chats
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Fetching Chats", error);
        return Response.json(
            {
                success: false,
                message: "Error Fetching all Chats"
            },
            { status: 500 }
        )
    }

}

