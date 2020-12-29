import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import styles from "./home.module.scss"
import { ReactComponent as Discovery } from "../../img/Discovery.svg"
import cards from "../../img/cards.svg"
import itinerary from "../../img/itinerary.svg"

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
      <div style={{ marginBottom: "-50px" }} className={styles.block}>
        <Discovery className={styles.cover_photo} />
        <div className={styles.banner}>
          <div className={styles.banner_slogan}>
            規劃旅行
            <br />
            可以更簡單！
          </div>
          <div className={styles.banner_text}>
            使用 PPlanner 讓您更有效率地整理旅遊資訊
            <br />
            和旅伴一起安排行程不再困難重重！
          </div>
          <div className={styles.button} onClick={handleClick}>
            現在開始體驗
          </div>
        </div>
      </div>

      <div className={styles.card_block}>
        <div className={styles.cards_section}>
          <div className={styles.cards_slogan}>
            視覺化
            <br />
            旅程的每一步
          </div>
          <div className={styles.cards_text}>
            透過卡片板系統性記錄所蒐集到的旅遊資訊
            <br />
            不論是檢索歸納、和旅伴討論都超方便！
          </div>
        </div>
        <img src={cards} alt="" className={styles.cards_svg} />
      </div>
      <div className={styles.itinerary_block}>
        <div className={styles.cards_section}>
          <div className={styles.cards_slogan}>
            動態拖拉
            <br />
            輕鬆安排行程
          </div>
          <div className={styles.cards_text}>
            透過在畫面拖拉的方式移動待定行程
            <br />
            新增、刪改旅行計劃都超 Easy！
          </div>
        </div>
        <img src={itinerary} alt="" className={styles.itinerary_svg} />
      </div>
    </div>
  )
}

export default Home
