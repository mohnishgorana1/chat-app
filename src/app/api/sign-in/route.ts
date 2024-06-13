import { generateToken } from "@/src/helpers/jwt";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";



export const POST = async (request: NextRequest) => {
    await dbConnect()

    try {
        const formData = await request.formData()
        // get all data  
        console.log(formData);
        
        const email = formData.get('email')
        const password = formData.get('password')

        // validation check
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Login Form Data Not Found"
                },
                { status: 404 }
            )
        }

        const userExists = await UserModel.findOne({ email }).select("+password")
        if (!userExists) {
            console.log("user not Exists");

            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                },
                { status: 500 }
            )
        }
        console.log("user found", userExists);

        const isPasswordCorrect = await bcryptjs.compare(password as string, userExists.password);

        if (!isPasswordCorrect) {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Password",
                },
                { status: 404 }
            )
        }
        console.log("Password correct");
        
        const userId = userExists?._id
        const token = generateToken(userId)
        if (token) {
            console.log("Token Generated");
        }
        else {
            return Response.json({
                success: false,
                message: "Credentials are right but can't generate token"
            }, { status: 500 });
        }

        return Response.json(
            {
                success: true,
                message: "Login Successfully",
                token,
                user: {
                    id: userId,
                    name: userExists.name,
                    email: userExists.email,
                    avatar: {
                        public_id: userExists.avatar?.public_id,
                        secure_url: userExists.avatar?.secure_url
                    },
                    isAcceptingMessages: userExists.isAcceptingMessages
                }
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Registration", error);
        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            },
            { status: 500 }
        )
    }

}

