"use client";

import Image from "next/image";
import React, { useState } from "react";
import axios from 'axios'
import { Button } from '../../../components/ui/button'
import { TextGenerateEffect } from '../../../components/ui/text-generate-effect'
import { SparklesCore } from '../../../components/ui/sparkles'
import Link from "next/link";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  // const [avatar, setAvatar] = useState("")
  const router = useRouter()

  // const [previewImage, setPreviewImage] = useState("")

  // const handleImage = (e: any) => {
  //   e.preventDefault()
  //   const uploadedImage = e.target.files[0];

  //   if (uploadedImage) {
  //     setAvatar(uploadedImage)
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(uploadedImage);
  //     fileReader.addEventListener("load", function () {
  //       console.log(this.result);
  //       const result = this.result as string
  //       setPreviewImage(result);
  //     });
  //   }
  //   console.log(uploadedImage);

  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('gender', gender)
    // formData.append('avatar', avatar)

    const formDataEntries = Array.from(formData.entries());
    for (const pair of formDataEntries) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.post('/api/sign-up', formData)

    if (response?.data?.success === true) {
      setIsSubmitting(false)
      console.log("response", response);
      toast.success("Account Created")
      router.replace('/sign-in')
    } else {
      toast.success("Error Sign-Up")
      console.log(response);
    }

  }

  // bg-dot-white-1/[0.1] relative
  return (
    <main className="flex justify-center items-center w-full min-h-screen px-2 bg-[#08121d]">
      <div className="mt-3 mb-2 sm:py-2 pt-3 sm:pt-3 px-3 sm:px-5 pb-2 flex flex-col items-center justify-center gap-5 rounded-xl shadow-sm shadow-orange-200">
        <header className="flex flex-col items-center justify-center ">
          <h1 className="font-bold text-pink-600 text-xl sm:text-3xl">Register with QuickChat</h1>
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={1200}
            className="-mt-10 w-full h-[60px]"
            particleColor="#ffffff"
          />
          <span className="text-white-1 text-center text-[5px]">
            <TextGenerateEffect className="" words={"Connect Fast, Chat Effortlessly"} />
          </span>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">

          {/* <div className={`self-center border border-white-2 border-opacity-10 p-2 rounded-full`}>
            <label htmlFor="avatar" className="cursor-pointer">
              {previewImage ? (
                <Image
                  src={previewImage}
                  height={52}
                  width={52}
                  alt="profile"
                  className="w-24 h-24 rounded-full m-auto"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center text-center rounded-full">
                  <span className="text-[12px] text-blue-400 font-extrabold">Upload Avatar</span>
                </div>
              )}
            </label>
            <input
              className="hidden"
              type="file"
              name="avatar"
              id="avatar"
              accept=".jpg, .jpeg, .png, .svg"
              onChange={handleImage}
            />
          </div> */}

          <div className="text-sm sm:text-lg w-full flex justify-evenly sm:gap-8 items-center">
            <label htmlFor="name" className="text-white-1 w-[20%]">
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              className="pl-5 py-1 rounded-xl w-[60%]"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="text-sm sm:text-lg w-full flex justify-evenly sm:gap-8 items-center">
            <label htmlFor="email" className="text-white-1 w-[20%]">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="pl-5 py-1 rounded-xl w-[60%]"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-sm sm:text-lg w-full flex justify-evenly sm:gap-8 items-center">
            <label htmlFor="password" className="text-white-1 w-[20%]">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="pl-5 py-1 rounded-xl w-[60%]"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-white-1 text-sm sm:text-lg w-full flex justify-evenly sm:gap-8 items-center">
            <label className="w-[20%]">Gender:</label>
            <div className="w-[60%] flex items-center gap-5">
              <label>
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  className="mx-1"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  className="mx-1"
                />
                Female
              </label>
            </div>
          </div>

          <Button
            className="self-center sm:self-auto text-white-1 py-1 sm:py-2 mt-5 bg-pink-700 duration-500 hover:bg-pink-600 hover:border-none 
            font-bold sm:text-lg ">
            {
              !isSubmitting ? (
                <>
                  Create Account
                </>
              ) : (
                <>
                  Submitting <Loader className="animate-spin" />
                </>
              )
            }

          </Button>
        </form>
        <span className="text-white-1 ">Already registered ?&nbsp;
          <Link href={'/sign-in'} className="text-blue-500 underline">
            Please Login
          </Link>
        </span>
      </div >
    </main >
  );
}

export default SignUpPage;