'use client'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CiSearch } from "react-icons/ci";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoMdArrowBack, IoMdMenu, IoMdSend } from "react-icons/io";
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast';
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
// import socket from '../../../lib/socket';
import Pusher from 'pusher-js';
import { pusherConfig } from '@/src/config/pusherConfig';



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

  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false)
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  const [messageContent, setMessageContent] = useState("")
  const [messages, setMessages] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({}) // Unread counts for each chat
  const chatContainerRef = useRef(null); // Ref for chat container


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
    if (isLoggedIn) {
      fetchAllChats(); // Ensure myChats gets populated
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (myChats.length > 0) {
      const initialUnreadCounts = {};
      myChats.forEach(chat => {
        initialUnreadCounts[chat._id] = 0;
      });
      setUnreadCounts(initialUnreadCounts);
    }
  }, [myChats])

  useEffect(() => {
    console.log(messages);
  }, [messages, setMessages])


  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  // socket
  // useEffect(() => {
  //   socket.on('message', (msg) => {
  //     console.log("received msg", msg);
  //     if (msg.chatId === currentChat?._id) {
  //       setMessages((prevMessages) => [...prevMessages, msg]);
  //     } else {
  //       setUnreadCounts((prevCounts) => ({
  //         ...prevCounts,
  //         [msg.chatId]: (prevCounts[msg.chatId] || 0) + 1
  //       }));
  //       console.log("Message Belong to other chat");
  //     }
  //   });
  //   return () => {
  //     socket.off('message');
  //   };
  // }, [currentChat]);


  // pusher
  useEffect(() => {

    const pusher = new Pusher(pusherConfig.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: 'ap2'
    });
    console.log("pusher", pusher);

    // Subscribe to channels for all chats
    myChats.forEach(chat => {
      const channel = pusher.subscribe(`chat-${chat._id}`);
      channel.bind('message', (msg) => {
        if (msg.chatId === chat._id) {
          setMessages(prevMessages => [...prevMessages, msg]);
          if (chat._id !== currentChat?._id) {
            setUnreadCounts(prevCounts => ({
              ...prevCounts,
              [chat._id]: (prevCounts[chat._id] || 0) + 1,
            }));
          }
        }
      });
    });

    // Clean up
    return () => {
      pusher.disconnect();
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

    router.replace('/')
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

      const sortedChats = response?.data?.chats.sort((a, b) => {
        const latestMessageA = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].createdAt).getTime() : 0;
        const latestMessageB = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].createdAt).getTime() : 0;
        return latestMessageB - latestMessageA; // Descending order
      })
      setMyChats(sortedChats)
      // toast.success("Chats Fetched Successfully!")
      setCurrentChat(null)
      setIsChatWindowOpen(false)

    } catch (error) {
      toast.error("Error Fetching Chats!")
    }
  }

  async function openChat(chat) {

    setIsChatWindowOpen(true)

    // console.log("curr Chat", chat);
    setCurrentChat(chat)
    fetchAllMessages(chat)

    // socket.emit("joinChat", chat._id);

    // Reset unread count for the chat
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [chat._id]: 0
    }));
  }

  async function closeChat() {
    setIsChatWindowOpen(false)
    setCurrentChat(null)
  }

  async function fetchAllMessages(chat) {
    // console.log("now fetch messages");
    // console.log(chat);
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

      if (response.data.success) {
        const newMessage = {
          chatId: chat._id,
          senderId: userId,
          content: messageContent,
          sender: { _id: userId },
        };

        // setMessages((prevMessages) => [...prevMessages, newMessage]); // not using this because server broadcast to us and we already setMessages
        setMessageContent("")

        console.log("sending msg", newMessage);

        // socket.emit('message', newMessage)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // helper function to0 find the index of the lastMEssage by each user
  const getLastMessageIndex = (messages) => {
    const senderLastIndex = messages.map(m => m.sender?._id).lastIndexOf(userId)
    const receiverLastIndex = messages.map(m => m.sender?._id)
      .lastIndexOf(currentChat?.users?.find(u => u._id !== userId)?._id);


    return { senderLastIndex, receiverLastIndex }
  }
  const { senderLastIndex, receiverLastIndex } = getLastMessageIndex(messages);



  return (
    <main className={`w-full flex flex-col bg-black-3 sm:px-4 gap-y-3`}>

      <nav className={`sm:h-[10vh] h-[6vh] bg-black-2 flex items-center justify-between px-10 mt-2 pt-1 rounded-2xl`}>
        <Link href={'/'} className='text-pink-600 text-xl sm:text-3xl font-extralight tracking-wider'>QuickChat</Link>
        <span className="relative flex items-center sm:gap-5">
          <button
            className='hidden sm:block text-base sm:text-xl text-blue-600  underline '
            onClick={fetchAllChats}
          >Refresh Chats
          </button>
          <button
            className='block sm:hidden text-base sm:text-xl text-blue-600  underline mb-1 mr-2'
            onClick={fetchAllChats}
          >Chats
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoMdMenu className='text-white-1 text-3xl sm:text-5xl' />
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

      <div className='w-full h-[90vh] flex sm:gap-4'>

        {/* sidebar */}
        <div className={`${isChatWindowOpen ? "hidden sm:block sm:w-[25%]" : "w-full sm:w-[25%]"} max-h-[90vh] bg-black-1 rounded-2xl px-2 sm:px-5 sm:pt-5`}>
          {/* search box  */}
          <div className={`rounded-xl w-full flex items-center justify-between border-2 border-black-4`}>
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
                        className='border border-x-0 border-y-black-3 py-2 flex gap-x-2 mt-5 items-center px-3'
                      >
                        <Image
                          src={user.avatar.secure_url} alt='user' height={28} width={48}
                          className='rounded-full'
                        />
                        <span className='w-full flex items-center justify-between'>
                          <h1 className='ml-2 font-bold text-white-1'>{user.name}</h1>
                          <span
                            className='bg-pink-600 text-white-1 rounded-xl text-sm px-2 py-1 cursor-pointer hover:scale-105 duration-200 ease-in font-bold'
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
                      className={`${isSearching ? "hidden" : "block"} z-20 border py-2 cursor-pointer flex mt-5 items-center justify-between sm:px-3`}
                      onClick={() => openChat(chat)}
                    >
                      <div className='flex items-center'>
                        <Image
                          src={otherUser?.avatar.secure_url}
                          alt='user'
                          height={48}
                          width={48}
                          className='rounded-full'
                        />
                        <h1 className='font-bold text-white-1 ml-4'>{otherUser?.name}</h1>
                      </div>
                      {unreadCounts[chat._id] > 0 && (
                        <span className='bg-red-500 text-white-1 rounded-full px-2 py-1 text-sm'>
                          {unreadCounts[chat._id]}
                        </span>
                      )}
                    </section>
                  )
                })
              )
            }
          </div>


        </div>
        {/* chatwindow */}
        <section className={`${isChatWindowOpen ? "w-full sm:w-[75%]" : "hidden sm:w-[75%]"} max-h-[90vh] bg-black-1 rounded-2xl`}>
          {/* chatWindow */}
          {
            currentChat && (() => {
              const otherUser = currentChat?.users?.find(user => user?._id !== userId)
              return (
                <div className='h-[87vh] m-1'>
                  <header className='mt-2 mx-1 rounded-xl h-[10vh] bg-black-3 flex items-center justify-between'>
                    <span className='sm:ml-4 flex items-center sm:gap-4'>
                      <button className='bg-black-2 h-[6vh] sm:h-[8vh]   ml-2 mr-4 px-2 sm:px-5 rounded-full hover:bg-black-5'
                        onClick={closeChat}
                      >
                        <IoMdArrowBack className='text-white-1 sm:text-3xl' />
                      </button>
                      <span className='hidden sm:block'>
                        <Image src={otherUser.avatar.secure_url} width={52} height={52} alt='avatar' className='rounded-full' />
                      </span>
                      <span className='sm:hidden'>
                        <Image src={otherUser.avatar.secure_url} width={36} height={36} alt='avatar' className='rounded-full' />
                      </span>
                      <h1 className='sm:pl-5 pl-3  text-white-1 font-extrabold text-xl sm:text-3xl'>{otherUser.name}</h1>
                    </span>
                    <Button className="w-10 sm:w-12 mr-5">
                      <FaEllipsisVertical className='text-white-1 font-bold  sm:text-xl' />
                    </Button>
                  </header>
                  <section className='mt-2 mx-1 rounded-xl bg-black-3 h-[75vh] flex flex-col'>
                    <div className='h-[72vh] overflow-y-scroll p-4 pb-16' ref={chatContainerRef}>
                      {/* all messages */}
                      {
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.sender?._id === userId ? 'justify-end' : 'justify-start'} mt-2`}
                          >
                            <div
                              className={`max-w-[80%] mx-2 sm:px-4 sm:py-2 px-2 py-1 text-sm sm:text-lg  rounded-lg  text-white-1 ${message.sender._id.toString() === userId ? 'bg-blue-800 text-white' : 'bg-pink-600 tracking-wider'}`}
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