import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import { checkUserStatus, listenToUser } from "../../firebase/Config"
import { initUser } from "../../app/slices/userSlice"

const CheckUser = () => {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const handleUpdate = (res) => {
    dispatch(initUser(res))
  }

  const handleUser = (currentUser) => {
    if (user.id !== currentUser.uid) {
      listenToUser(currentUser.uid, handleUpdate)
    }
  }

  const handleNoUser = () => {
    //allow page to show and then ask user to login
    if (location.pathname.slice(1, 12) === "joinProject") {
    }

    //redirect to home page if not invited
    if (location.pathname.slice(1, 12) !== "joinProject") {
      history.push("/")
    }
  }

  //check login
  useEffect(() => {
    checkUserStatus(handleUser, handleNoUser)
  }, [])

  // useEffect(()=>{

  //   const unsubscribe=listenToUser()

  //   return unsubscribe
  // },[])

  return <div></div>
}

export default CheckUser
