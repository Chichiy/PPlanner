import React, { useState } from "react"
import { useParams } from "react-router-dom"

import BoardSelect from "./BoardSelect"
import CardSelect from "./CardSelect"
import DaySelect from "./DaySelect"
import styles from "./Navbar.module.scss"

const FeatureBar = () => {
  const { boardType } = useParams()

  const [mobileShow, setShow] = useState(false)
  const toggleMoibleCardSelect = () => {
    setShow(!mobileShow)
  }

  return (
    <div className={styles.board_bar}>
      <div className={styles.board_select}>
        <BoardSelect />
      </div>

      {boardType === "cards" && (
        <div
          className={
            mobileShow
              ? `${styles.card_select} ${styles.mobile_card_select__show}`
              : styles.card_select
          }
        >
          <CardSelect />
        </div>
      )}
      {boardType === "cards" && (
        <div
          className={
            mobileShow
              ? styles.mobile_menu_search_icon__current
              : styles.mobile_menu_search_icon
          }
          onClick={toggleMoibleCardSelect}
        ></div>
      )}

      {boardType === "itineraries" && (
        <div className={styles.daySelect_container}>
          <DaySelect />
          <div className={styles.daySelect_tooltip_text}>選擇起始日期</div>
        </div>
      )}
    </div>
  )
}

export default FeatureBar
