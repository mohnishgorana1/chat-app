import { generateToken } from "@/src/helpers/jwt";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";
import MessageModel from "@/src/model/MessageModel";



export const POST = async (request: NextRequest) => {
    await dbConnect()
    const { chatId } = await request.json()

    try {
        const messages = await MessageModel.find({chat: chatId})
            .populate('sender', 'name email avatar')
            .sort({createdAt: 1})
            .exec()

        // console.log("messages");
        

        return Response.json(
            {
                success: true,
                message: "Messages Fetched Successfully",
                messages: messages
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Fetching Messages", error);
        return Response.json(
            {
                success: false,
                message: "Error Fetching all Messages"
            },
            { status: 500 }
        )
    }

}

