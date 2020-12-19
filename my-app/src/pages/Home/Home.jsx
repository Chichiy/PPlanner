import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import styles from "./home.module.scss"

const Home = () => {
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const handleClick = () => {
    if (user.id) {
      history.push({ pathname: "/projects" })
    } else {
      history.push({ pathname: "/", state: { showPopup: "signIn" } })
    }
  }

  return (
    <div className={styles.view}>
      <div className={styles.banner}>
        現在開始規劃旅行吧！
        <br />
        {/* <Link to="/projects" className={styles.button_border}>
          GO
        </Link> */}
        <div className={styles.button_border} onClick={handleClick}>
          GO
        </div>
      </div>
    </div>
  )
}

export default Home
