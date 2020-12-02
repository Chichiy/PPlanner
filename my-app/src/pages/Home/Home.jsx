import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./home.module.scss"

const Home = () => {
  return (
    <div className={styles.view}>
      <div className={styles.banner}>
        現在開始規劃旅行吧！
        <br />
        <Link to="/projects" className={styles.button_border}>
          GO
        </Link>
      </div>
    </div>
  )
}

export default Home
