import { generateToken } from "@/src/helpers/jwt";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";
import ChatModel from "@/src/model/ChatModel";



export const POST = async (request: NextRequest) => {
    await dbConnect()
    const { userId } = await request.json()
    const user = await UserModel.findById(userId)
    console.log(user);
    
    try {
        console.log("fetching chats");

        const chats = await ChatModel.find({ users: userId })
            .populate('users', 'name email avatar ')
        console.log("chats",chats);
    

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

