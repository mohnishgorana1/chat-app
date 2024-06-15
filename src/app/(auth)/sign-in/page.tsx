"use client";

import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import axios from 'axios'
import { TextGenerateEffect } from "@/src/components/ui/text-generate-effect";
import { SparklesCore } from "@/src/components/ui/sparkles";
import Link from "next/link";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';

function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()




  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const formDataEntries = Array.from(formData.entries());
    for (const pair of formDataEntries) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.post('/api/sign-in', formData)
    if (response?.data?.success === true) {
      console.log("response", response);

      setCookie('token', response.data.token, { maxAge: 60 * 60 * 24 })
      setCookie('user', JSON.stringify(response.data.user), { maxAge: 60 * 60 * 24 })

      // local storage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))


      toast.success("Logged In")
      setIsSubmitting(false)
      router.replace('/dashboard')
    }
    else {
      setIsSubmitting(false)
    }
    setIsSubmitting(false)



  };

  // bg-dot-white-1/[0.1] relative
  return (
    <main className="flex justify-center items-center w-full h-screen px-2 bg-black-3">
      <div className="h-[80vh] mt-3 mb-2 px-3 sm:px-5 flex flex-col items-center justify-center gap-5 rounded-xl shadow-md shadow-pink-900">
        <header className="flex flex-col items-center justify-center ">
          <h1 className="font-bold text-pink-600 text-xl sm:text-3xl">Login to Quick Chat</h1>
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={1200}
            className="-mt-10 w-full h-[60px]"
            particleColor="#ffffff"
          />
          <span className="text-white-1 text-center">
            <TextGenerateEffect className="" words={"Your Chats Are Just a Click Away"} />
          </span>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">



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



          <Button
            className="self-center sm:self-auto text-white-1 py-1 sm:py-2 mt-5 bg-pink-700 duration-500 hover:bg-pink-600 hover:border-none 
            font-bold sm:text-lg ">
            {
              !isSubmitting ? (
                <>
                  Login
                </>
              ) : (
                <>
                  Submitting <Loader className="animate-spin" />
                </>
              )
            }

          </Button>
        </form>
        <span className="text-white-1 text-sm sm:text-[15px]">Do not have an account ?&nbsp;
          <Link href={'/sign-up'} className="text-pink-600  underline ">
            Click to Register
          </Link>
        </span>
      </div>
    </main>
  );
}

export default SignInPage;
