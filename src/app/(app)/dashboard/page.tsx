'use client'
import React, { useEffect, useState } from 'react'

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [name, setName] = useState("")


  useEffect(() => {
    // find user
    const user = localStorage.getItem("user")
    if (user) {
      const currentUser = JSON.parse(user)
      setIsLoggedIn(true)
      setUserId(currentUser.id)
      setName(currentUser.name)
    }
  }, [])
  return (
    <div>
      {userId && <p>{name}</p> }
    </div>
  )
}

export default Dashboard