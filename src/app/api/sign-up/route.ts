import cloudinary, { v2 } from "cloudinary";
import fs from "fs/promises";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";


v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const POST = async (request: NextRequest) => {
  await dbConnect()

  try {
    const formData = await request.formData()
    // get all data  
    console.log(formData);
    
    const avatar = formData.get('avatar')
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    // validation check
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration Form Data Not Found"
        },
        { status: 404 }
      )
    }
    if (!avatar) {
      return NextResponse.json(
        {
          success: false,
          message: "Avatar File not found from request"
        },
        { status: 404 }
      )
    }

    console.log(name, email, password);
    console.log("file", avatar);
    console.log(typeof (email), typeof (name), typeof (password), typeof (avatar));
    


    // now file exists: not using multer instead doing manually and saving 
    const buffer = await avatar.arrayBuffer();
    const tempFilePath = `./uploads/${avatar.name}`;
    await writeFile(tempFilePath, Buffer.from(buffer));

    // const byteData = await avatar.arrayBuffer()
    // const buffer = Buffer.from(byteData)
    // const path = `./uploads/${avatar.name}`
    // await writeFile(path, buffer)


    // using multer
    // try {
    //   upload.single('avatar')
    // } catch (error) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Multer Error!"
    //     },
    //     { status: 500 }
    //   )
    // }



    const userExists = await UserModel.findOne({ email })
    if (userExists) {
      console.log("user Exists", userExists);

      return Response.json(
        {
          success: false,
          message: "User Already Exists"
        },
        { status: 500 }
      )
    }

    // create a new user 
    console.log("Creating new User");

    const user = await UserModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: "",
        secure_url: ""
      },
      isAcceptingMessages: true
    })

    try {
      console.log("uploading to cloudinary");

      const result = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder: "quickchat",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        console.log("got result of cloudinary", result);

        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // avatar uploaded and saved to user.avatar now let save the password
        const hashedPassword = await bcryptjs.hash(password as string, 10)
        user.password = hashedPassword
        await user.save();
        


        // remove file from local system
        await fs.unlink(tempFilePath);
      }
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "Avatar File Not Uploading to our Storage!, Please Try Again"
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Account Created Successfully",
        user: user,
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
