'use client'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CiSearch } from "react-icons/ci";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast';
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import socket from '../../../lib/socket';



function Dashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState(null)

  const [isSearching, setIsSearching] = useState(false)
  const [searchedChats, setSearchedChats] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  const [myChats, setMyChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)

  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false) // useful for mobile ui

  const [messageContent, setMessageContent] = useState("")
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")


  const chatContainerRef = useRef(null)   // Ref for chat container
  



  // get the user as components load
  useEffect(() => {
    // find user
    const user = localStorage.getItem("user")
    if (!user) {
      router.replace('/sign-in')
    }
    else {
      const currentUser = JSON.parse(user)
      setIsLoggedIn(true)
      setUserId(currentUser.id)
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    fetchAllChats()
  }, [isLoggedIn])

  useEffect(() => {
    console.log(messages);
  }, [messages, setMessages])

  useEffect(() => {
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop  = chatContainerRef.current.scrollHeight
    }
  },[messages])



  // socket
  useEffect(() => {
    socket.on('message', (msg) => {
      console.log("received msg", msg);
      
      if (msg.chatId === currentChat?._id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }else{
        console.log("Message Belong to other chat");
      }
    });

    return () => {
      socket.off('message');
    };
  }, [currentChat]);


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
  }

  async function getAllUsers(searchKeyword: string, userId: string) {
    if (!searchKeyword) {
      return
    }
    try {
      setIsSearching(true)
      // console.log("search", searchKeyword);

      const response = await axios.post('/api/get-all-users', { searchKeyword, userId: userId })
      // console.log(response);
      if (response?.data?.success) {
        setSearchedChats(response?.data?.users)
      }

    } catch (error) {
      console.log(error);
    }

  }
  function abortSearch() {
    setIsSearching(false)
    setSearchedChats(null)
    setSearchKeyword("")
  }

  async function accessChat(user: any) {
    // console.log(`creating chat btw  requestPerson: ${user._id}, myId: ${userId}`,);

    try {
      const response = await axios.post('/api/access-chat', {
        requestedPersonToChat: user._id,
        requestingPersonForChat: userId
      })
      console.log(response);

      if (response?.data?.success) {
        if (response.data.isChatAlreadyExist) {
          toast.success("Chat Already Exists")
        }
        openChat(response.data.chat)
        toast.success(response.data.message)
        abortSearch()
      }
    } catch (error) {
      toast.error("Can't Create Chat")
    }
  }

  async function fetchAllChats() {
    try {
      const response = await axios.post('/api/fetch-chats', { userId })
      // console.log(response);

      const fetchedChats = response?.data?.chats
      setMyChats(fetchedChats)
      toast.success("Chats Fetched Successfully!")

    } catch (error) {
      toast.error("Error Fetching Chats!")
    }
  }

  async function openChat(chat) {
    console.log("curr Chat", chat);
    setIsChatWindowOpen(true)

    setCurrentChat(chat)

    fetchAllMessages(chat)

    socket.emit("joinChat", chat._id)
  }

  async function fetchAllMessages(chat) {
    console.log("now fetch messages");
    console.log(chat);
    try {
      const response = await axios.post('/api/fetch-messages', { chatId: chat._id })
      console.log(response);

      if (response?.data?.success) {
        setMessages(response.data.messages)
      }
    } catch (error) {
      toast.error("Error Fetching Messages")
    }
  }


  // send a new message and update chat window
  async function sendMessage(e: any, chat, messageContent: string) {
    e.preventDefault()
    console.log(chat._id, messageContent);
    if (messageContent === "") {
      return
    }

    try {
      const response = await axios.post('/api/send-message', {
        chatId: chat._id,
        messageContent: messageContent,
        senderId: userId
      })

      console.log(response);

      if (response.data.success) {
        // fetchAllMessages(chat)
        
        const newMessage = {
          chatId: chat._id,
          senderId: userId,
          content: messageContent,
          sender: { _id: userId },
        };
        
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageContent("")
        
        console.log("sending msg", newMessage);
        
        socket.emit('message', newMessage)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }



  return (
    <main className='w-full flex flex-col min-h-screen bg-black-3 sm:px-4 pb-5'>
      <nav className='bg-black-2 flex items-center justify-between px-10 my-2  py-3 rounded-2xl'>
        <Link href={'/'} className='text-pink-600 text-xl sm:text-3xl font-extralight tracking-wider'>QuickChat</Link>
        {
          !isLoggedIn ? (
            <Link href={'/sign-in'}>
              <Button className='bg-pink-600 hover:bg-pink-700 font-extrabold px-8 py-2 rounded-lg text-white-1'>Login</Button>
            </Link>
          ) : (
            <div className='flex items-center justify-center gap-3'>
              <div className='bg-pink-600 hover:bg-pink-700 font-extrabold px-8 py-2 rounded-lg text-white-1'>
                <AlertDialog>
                  <AlertDialogTrigger>Profile</AlertDialogTrigger>
                  <div className='relative'>
                    <AlertDialogContent className='bg-white-1 '>
                      <div>
                        <AlertDialogCancel className='p-0 bg-black-6 text-white-1 hover:bg-black-3 border-2 absolute top-1 right-2'>
                          <Button className='font-bold'>Close</Button>
                        </AlertDialogCancel>
                      </div>
                      <div className='w-full flex flex-col items-center justify-center gap-8'>
                        <h1 className='font-bold text-xl sm:text-3xl'>Profile</h1>
                        {user && (
                          <section className='flex flex-col gap-4'>
                            <Image src={user?.avatar.secure_url} width={150} height={150} alt='avatar' className='rounded-full self-center' />
                            <span className='flex items-center gap-5'>
                              <p className='font-bold'>Name: </p>
                              <p>{user?.name}</p>
                            </span>
                            <span className='flex items-center gap-5'>
                              <p className='font-bold'>Email: </p>
                              <p>{user?.email}</p>
                            </span>
                          </section>
                        )
                        }
                      </div>
                    </AlertDialogContent>
                  </div>

                </AlertDialog>
              </div>
              <Button className='bg-black-3 border-2 border-black-3 hover:border-white-1 font-extrabold px-7 py-2 rounded-lg text-white-1' onClick={handleLogout}>Logout</Button>
              <button className='p-2 border-2 bg-transparent text-blue-600 border-blue-600' onClick={fetchAllChats}>FetchChats</button>
            </div>

          )
        }
      </nav>


      <div className='h-[90vh] grid grid-cols-12 gap-4'>

        <div className='max-h-[90vh] sm:col-span-3 bg-black-1 rounded-2xl sm:px-5 sm:pt-5'>
          {/* search box  */}
          <div className="rounded-xl w-full flex items-center justify-between border-2 border-black-4">
            <input
              type="text"
              placeholder='Search User'
              className='w-[70%] bg-transparent h-8 pl-4 border-none text-white-1 font-extrabold '
              value={searchKeyword}
              name='searchKeyword'
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setIsSearching(true)
              }}
            />
            <span className='w-[30%] flex items-center justify-between px-2'>
              <AiOutlineClose className='text-white-2' onClick={abortSearch} />
              <CiSearch
                className=' text-white-1 font-extrabold h-6 text-3xl cursor-pointer'
                onClick={() => getAllUsers(searchKeyword, userId!)}
              />
            </span>
          </div>

          {/* searched chats*/}
          {isSearching &&
            (
              <section className='h-[72vh] bg-black-4'>
                {searchedChats &&
                  (
                    searchedChats.map((user) => (
                      <div
                        key={user._id}
                        className='border border-x-0 border-y-black-3 py-2 flex mt-5 items-center sm:px-3 '
                      >
                        <Image
                          src={user.avatar.secure_url} alt='user' height={28} width={48}
                          className='rounded-full'
                        />
                        <span className='w-full flex items-center justify-between'>
                          <h1 className='ml-2 font-bold text-white-1'>{user.name}</h1>
                          <span
                            className='bg-blue-300 rounded-xl text-sm px-2 py-1 cursor-pointer hover:scale-105 duration-200 ease-in font-bold'
                            onClick={(e) => accessChat(user)}
                          >Chat
                          </span>
                        </span>
                      </div>
                    ))
                  )
                }
              </section>
            )
          }

          {/* all fetched chats  */}
          <div className='sm:px-3 mt-5 '>
            {
              myChats && (
                myChats.map((chat) => {
                  const otherUser = chat.users.find(user => user._id.toString() !== userId)
                  return (
                    <section
                      key={chat._id}
                      className='z-20 border py-2 cursor-pointer flex mt-5 items-center justify-between sm:px-3'
                      onClick={() => openChat(chat)}
                    >
                      <Image
                        src={otherUser?.avatar.secure_url} alt='user' height={48} width={48}
                        className='rounded-full'
                      />
                      <h1 className='font-bold text-white-1'>{otherUser?.name}</h1>
                    </section>
                  )
                })
              )
            }
          </div>


        </div>

        <section className='max-h-[90vh] sm:col-span-9 bg-black-1 rounded-2xl'>
          {/* chatWindow */}
          {
            currentChat && (() => {
              const otherUser = currentChat?.users?.find(user => user?._id !== userId)
              return (
                <div className='h-[87vh] m-1'>
                  <header className='mt-2 mx-1 rounded-xl h-[10vh] bg-black-3 flex items-center justify-between '>
                    <span className='ml-2 sm:ml-4 flex items-center gap-3'>
                      <Image src={otherUser.avatar.secure_url} width={52} height={52} alt='avatar' className='rounded-full' />
                      <h1 className='sm:pl-5 pl-3  text-white-1 font-extrabold text-xl sm:text-3xl'>{otherUser.name}</h1>
                    </span>
                    <Button className='border w-12 mr-5' >
                      <FaEllipsisVertical className='text-white-1 font-bold text-xl' />
                    </Button>
                  </header>
                  <section className='mt-2 mx-1 rounded-xl bg-black-3 h-[75vh] flex flex-col'>
                    <div className='h-[72vh] overflow-y-scroll p-4 pb-16' ref={chatContainerRef}>
                      {/* all messages */}
                      {
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.sender?._id === userId ? 'justify-end' : 'justify-start'} my-1`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-lg ${message.sender._id.toString() === userId ? 'bg-blue-800 text-white' : 'bg-pink-600 text-white-1 tracking-wider'}`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <form className='w-full flex items-center relative' onSubmit={(e) => sendMessage(e, currentChat, messageContent)}>
                      <input type="text"
                        placeholder='Enter Message'
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className='absolute left-0 w-full bg-black-4 h-[7vh] rounded-b-lg rounded-br-none pl-5 text-white-1 border-0 outline-0'
                      />
                      <Button type='submit' className='absolute right-0 h-[7vh] bg-pink-600 text-white rounded-tl-none rounded-bl-none'>
                        <IoMdSend />
                      </Button>
                    </form>

                  </section>
                </div>
              )
            })()
          }
        </section>
      </div>
    </main >
  )
}

export default Dashboard