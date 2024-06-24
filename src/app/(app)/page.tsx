'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MyGlobe from '../../components/MyGlobe'
import StickyScrollHomePage from '../../components/StickyScrollHomePage'
import { TypewriterEffectSmooth } from "@/src/components/ui/typewriter-effect";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdMenu } from "react-icons/io";


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // find user
    const user = localStorage.getItem("user")
    if (!user) {
      setIsLoggedIn(false)
    }
    else {
      const currentUser = JSON.parse(user)
      setIsLoggedIn(true)
      setUserId(currentUser.id)
      setUser(currentUser)
    }
  }, [])
  const wordsLine1 = [
    {
      text: "QuickChat",
      className: "text-pink-600 dark:text-blue-500",
    },
  ];

  const wordsLine2 = [

    {
      text: "Connect ",
    },
    {
      text: "Instantly, ",
    },
    {
      text: "Chat ",
    },
    {
      text: "Effortlessly !",
    },
  ];

  function handleLogout() {
    // cookie
    deleteCookie('token')
    deleteCookie('user')

    // local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    console.log("Logout Success");
    setIsLoggedIn(false)

    toast.success("Logout Success")

    router.replace('/')
  }

  return (
    <main className="sm:pt-6 pt-2 w-full min-h-[100vh] bg-[#000000] text-white-1">
      <nav className={`sm:px-12  sm:h-[10vh] h-[6vh] bg-black-1 flex items-center justify-between px-10 mt-2 pt-1 rounded-3xl mx-2 `}>
        <Link href={'/'} className='text-pink-600 text-xl sm:text-3xl font-extralight tracking-wider'>QuickChat</Link>
        <span className="relative flex items-center sm:gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoMdMenu className='text-white-1 text-xl sm:text-5xl' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-black-3 text-white-1 absolute top-2 -right-6 w-[15vw]'>
              <Link href={'/profile'}>
                <DropdownMenuLabel className='sm:text-2xl py-2 sm:py-3 '>My Account</DropdownMenuLabel>
              </Link>
              <DropdownMenuSeparator className='border-2 ' />
              {
                isLoggedIn ? (
                  <div className='my-5 flex flex-col '>
                    <DropdownMenuItem className='sm:text-lg text-base hover:bg-white-2 hover:text-black-3 ' onClick={handleLogout}>Logout</DropdownMenuItem>
                    <DropdownMenuSeparator className='border border-black-2' />
                    {/* <DropdownMenuItem className='sm:text-lg text-base hover:bg-white-2 hover:text-black-3 ' onClick={fetchAllChats}>Fetch Chats</DropdownMenuItem> */}
                  </div>
                ) : (
                  <div className="my-5 flex flex-col">
                    <Link href={'/sign-up'}>
                      <DropdownMenuItem className='sm:text-lg text-base hover:bg-white-2 hover:text-black-3 '>Sign Up</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className='border border-black-2' />
                    <Link href={'/sign-in'}>
                      <DropdownMenuItem className='sm:text-lg text-base hover:bg-white-2 hover:text-black-3 '>Sign In</DropdownMenuItem>
                    </Link>
                  </div>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>

        </span>
      </nav >
      <div className="flex flex-col">
        {/* globe section */}
        <section className="mt-12 flex flex-col ">
          <div className="flex flex-col items-center max-w-[100vw]">
            <TypewriterEffectSmooth words={wordsLine1} className="text-sm w-full flex items-center justify-center px-8" />
            <TypewriterEffectSmooth words={wordsLine2} className="mb-2 text-sm w-full flex items-center justify-center px-8" />
          </div>
          <div className="-mt-2 flex items-center justify-center">
            <span className="w-[100%]">
              <MyGlobe />
            </span>
          </div>
        </section>
        <section className="">
          <StickyScrollHomePage />
        </section>
        <div className="h-[50vh] bg-white-1"></div>
      </div>
    </main>
  );
}
