import cloudinary, { v2 } from "cloudinary";
import fs from "fs/promises";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/UserModel";
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";

import streamifier from 'streamifier'
import { parseMultipartForm } from "@/src/helpers/parseMultipart";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// async function parseMultipartForm(request: NextRequest) {
//   return new Promise((resolve, reject) => {
//     const multerUpload = upload.single('avatar');
//     const req = request as any; // Extend req with IncomingMessage properties
//     const res = new Writable({
//       write(chunk, encoding, callback) {
//         callback();
//       }
//     });

//     multerUpload(req, res, (err) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(req);
//     });
//   });
// }


export const POST = async (request: NextRequest) => {
  await dbConnect()

  try {
    const formData = await request.formData()
    console.log(formData);

    // const avatar = formData.get('avatar')
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const gender = formData.get("gender")


    // const req: any = await parseMultipartForm(request);
    // const { name, email, password } = req.body;
    // const avatar = req.file;
    // console.log("request", req );

    // validation check
    if (!name || !email || !password || !gender) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration Form Data Not Found"
        },
        { status: 404 }
      )
    }
    // if (!avatar) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Avatar File not found from request"
    //     },
    //     { status: 404 }
    //   )
    // }

    console.log(name, email, password);
    // console.log("file", avatar);
    console.log(typeof (email), typeof (name), typeof (password), typeof (gender));

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
    await user.save()
    console.log("user created success now file upload");

    // try {
    //   // now file exists: not using multer instead doing manually and saving 
    //   // const buffer = await avatar.arrayBuffer();
    //   // const tempFilePath = `./uploads/${avatar.name}`;
    //   // await writeFile(tempFilePath, Buffer.from(buffer));

    //   // console.log("file uploaded to server at upload folder");
    //   console.log("now uploading to cloudinary");

    //   const result = await cloudinary.v2.uploader.upload(tempFilePath, {
    //     folder: "quickchat",
    //     width: 250,
    //     height: 250,
    //     gravity: "faces",
    //     crop: "fill",
    //   });

    //   if (result) {
    //     console.log("got result of cloudinary", result);

    //     user.avatar.public_id = result.public_id;
    //     user.avatar.secure_url = result.secure_url;

    //     // avatar uploaded and saved to user.avatar now let save the password
    //     const hashedPassword = await bcryptjs.hash(password as string, 10)
    //     user.password = hashedPassword

    //     console.log("all Good now saving user to DB are successfull creation of account");

    //     await user.save();


    //     // remove file from local system
    //     await fs.unlink(tempFilePath);
    //   }
    // } catch (error) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Avatar File Not Uploading to our Storage!, Please Try Again"
    //     },
    //     { status: 500 }
    //   )
    // }

    // console.log("Account Created Successfully");

    // return Response.json(
    //   {
    //     success: true,
    //     message: "Account Created Successfully",
    //     user: user,
    //   },
    //   { status: 200 }
    // )

    // Upload to Cloudinary
    try {
      // const result = await new Promise((resolve, reject) => {
      //   const uploadStream = cloudinary.v2.uploader.upload_stream(
      //     {
      //       folder: 'quickchat',
      //       width: 250,
      //       height: 250,
      //       gravity: 'faces',
      //       crop: 'fill',
      //     },
      //     (error, result) => {
      //       if (error) {
      //         reject(error);
      //       } else {
      //         resolve(result);
      //       }
      //     }
      //   );
      //   console.log("Done Upload Stream");        

      //   streamifier.createReadStream(avatar.buffer).pipe(uploadStream);
      // });
      // console.log("Completed streamifier now saving image details to avatar")
      if (gender === "male") {
        user.avatar.secure_url = "https://res.cloudinary.com/dagszmhdo/image/upload/f_auto,q_auto/v1/quickchat/q3rvw5i7zxlt4gp7voci"
        user.avatar.public_id = "quickchat/q3rvw5i7zxlt4gp7voci"
      } else {
        user.avatar.secure_url = "https://res.cloudinary.com/dagszmhdo/image/upload/f_auto,q_auto/v1/quickchat/exj9sm4otlvq83bfn7wv"
        user.avatar.public_id = "quickchat/exj9sm4otlvq83bfn7wv"
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
      console.log("Password and avatar updated to db");

      await user.save();
      console.log("Account saved with avatar password and all details to DB! HEnce, account created");

      return NextResponse.json(
        {
          success: true,
          message: 'Account Created Successfully',
          user: user,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Avatar File Not Uploading to our Storage!, Please Try Again',
        },
        { status: 500 }
      );
    }

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
