'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState(null)
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

  return (
    <main className="flex flex-col pt-16 gap-8 items-center w-full min-h-screen bg-slate-900">
      <h1 className="text-white-1 text-5xl mb-8 ">Home Page</h1>
      <section className="px-12">
        {
          isLoggedIn ? (
            <Link href={'/dashboard'}>
              <button className="mt-12 px-6 py-3 border border-black-3 bg-pink-600 text-xl font-semibold tracking-widest rounded-2xl text-white-1">Click To Open Chat Dashboard Page</button>
            </Link>
          ) : (
            <div className="flex flex-col gap-16 items-center">
              <span className="flex flex-col sm:flex-row  items-center justify-between gap-4 text-white-1 " >
                <p className="sm:text-2xl">Do not have an account ?&nbsp;</p>
                <Link href={'/sign-up'}>
                  <button className="sm:w-40 px-6 py-3 border border-black-3 bg-pink-600 sm:text-xl font-semibold tracking-widest rounded-2xl text-white-1">Sign-Up</button>
                </Link>
              </span>
              <span className="flex flex-col sm:flex-row  items-center justify-between gap-4 text-white-1 ">
                <p className="sm:text-2xl">Already have an account ?&nbsp;</p>
                <Link href={'/sign-in'}>
                  <button className="sm:w-40 px-6 py-3 border border-black-3 bg-blue-500 sm:text-xl font-semibold tracking-widest rounded-2xl text-white-1">Sign-In</button>
                </Link>
              </span>
            </div>
          )
        }
      </section>

    </main>
  );
}
