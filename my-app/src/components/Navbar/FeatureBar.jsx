import React from "react"
import { useParams } from "react-router-dom"

import BoardSelect from "./BoardSelect"
import CardSelect from "./CardSelect"
import DaySelect from "./DaySelect"
import styles from "./Navbar.module.scss"

const FeatureBar = () => {
  const { boardType } = useParams()

  return (
    <div className={styles.board_bar}>
      <div className={styles.board_select}>
        <BoardSelect />
      </div>

      {boardType === "cards" && (
        <div className={styles.card_select}>
          <CardSelect />
        </div>
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
