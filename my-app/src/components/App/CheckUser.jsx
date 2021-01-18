import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import { checkUserStatus, listenToUser } from "../../firebase/lib"
import { initUser } from "../../redux/slices/userSlice"

const CheckUser = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const user = useSelector((state) => state.user)

  const handleUpdate = (res) => {
    dispatch(initUser(res))
  }

  const handleUser = (currentUser) => {
    if (user.id !== currentUser.uid) {
      listenToUser(currentUser.uid, handleUpdate)
    }
  }

  const handleNoUser = () => {
    const shouldRedirect = location.pathname.slice(1, 12) !== "joinProject"
    shouldRedirect && history.push("/")
  }

  useEffect(() => {
    checkUserStatus(handleUser, handleNoUser)
  }, [])

  return <div></div>
}

export default CheckUser
