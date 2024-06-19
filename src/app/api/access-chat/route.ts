import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import ChatModel from "../../../model/ChatModel";

import { NextRequest, NextResponse } from "next/server";



export const POST = async (request: NextRequest) => {
    await dbConnect()

    const { requestedPersonToChat, requestingPersonForChat } = await request.json()
    console.log(requestedPersonToChat, requestingPersonForChat);




    try {
        const requestedPerson = await UserModel.findById(requestedPersonToChat);
        const requestingPerson = await UserModel.findById(requestingPersonForChat);
        console.log("requestedPerson", requestedPerson);
        console.log("requestingPerson", requestingPerson);


        if (!requestedPerson || !requestingPerson) {
            return Response.json(
                {
                    success: false,
                    message: "Either You or Other Person Not Found in Database"
                },
                { status: 500 }
            )
        }


        const existingChat = await ChatModel.findOne({
            users: { $all: [requestedPersonToChat, requestingPersonForChat] }
        })
            .populate('users', 'name email avatar')
            .populate('messages')



        if (existingChat) {
            // filter logged in user
            const otherUser = existingChat.users.find(user => user._id !== requestingPersonForChat)
            console.log("other user existing chat", otherUser);

            console.log("Existing chat", existingChat);



            return Response.json(
                {
                    success: true,
                    message: "Chat Already Exists",
                    chat: existingChat
                },
                { status: 200 }
            )
        }




        if (requestedPerson.isAcceptingMessages === false) {
            return Response.json(
                {
                    success: false,
                    message: "OOPS! Requested Person is not accepting anyone requests to Chat!",
                },
                { status: 500 }
            )
        }




        // console.log("Creating new Chat");

        const newChat = await ChatModel.create({
            users: [requestedPersonToChat, requestingPersonForChat],
            messages: []
        })

        await newChat.save()
        const newlyCreatedChat = await ChatModel.findOne({
            users: { $all: [requestedPersonToChat, requestingPersonForChat] }
        }).populate('users', 'name email avatar').populate('messages')

        console.log("newlyCreatedChat", newlyCreatedChat);


        return Response.json(
            {
                success: true,
                message: "Chat Created Successfully",
                chat: newlyCreatedChat,
                isChatAlreadyExist: false,
            },
            { status: 200 }
        )

    } catch (error: any) {
        console.log("Error Creating Chat", error);
        return Response.json(
            {
                success: false,
                message: "Error Creating Chat",
                error: error.message
            },
            { status: 500 }
        )
    }

}

