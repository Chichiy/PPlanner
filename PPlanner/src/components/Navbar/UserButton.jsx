import React from "react"
import { useSelector } from "react-redux"
import styles from "./Navbar.module.scss"
import { getColor } from "../../utils/lib"
import { useParams } from "react-router-dom"

const UserButton = ({ isShowing, setShowing }) => {
  const { boardType } = useParams()
  const user = useSelector((state) => state.user)
  const isLoggedIn = user.id ? true : false

  const togglePopup = () => {
    isShowing !== "user" ? setShowing("user") : setShowing(false)
  }

  const switchClass = (type) => {
    if (boardType === "cards") {
      return styles[`user_${type}_cardBoard`]
    }
    if (boardType === "itineraries") {
      return styles[`user_${type}_itineraryBoard`]
    } else return styles[`user_${type}`]
  }

  if (isLoggedIn) {
    return (
      <div
        className={switchClass("icon")}
        onClick={togglePopup}
        style={{ backgroundColor: getColor(user.id) }}
      >
        {user.name[0]}
      </div>
    )
  } else {
    return (
      <div className={switchClass("buttons")}>
        <div
          className={styles.sign_in_button}
          onClick={() => {
            setShowing("signIn")
          }}
        >
          登入
        </div>

        <div
          className={styles.sign_up_button}
          onClick={() => {
            setShowing("signUp")
          }}
        >
          註冊
        </div>
      </div>
    )
  }
}

export default UserButton
