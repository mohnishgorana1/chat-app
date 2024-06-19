import { generateToken } from "@/src/helpers/jwt";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";



export const POST = async (request: NextRequest) => {
    await dbConnect()

    try {
        const { searchKeyword, userId } = await request.json()
        console.log("search:: ", searchKeyword);
        console.log("loog user id: ", userId);
        

        const regex = new RegExp(searchKeyword, "i")
        const users = await UserModel.findOne({
            $or: [
                { name: regex },
                { email: regex }
            ]
        }).find({ _id: { $ne: userId } }).select("-password")

        console.log("users", users);

        return Response.json(
            {
                success: true,
                message: "Searched Users Fetched Successfully",
                users
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error Fetching Searched Users", error);
        return Response.json(
            {
                success: false,
                message: "Error Fetching all Searched User"
            },
            { status: 500 }
        )
    }

}

