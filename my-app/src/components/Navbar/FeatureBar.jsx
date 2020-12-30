import React from "react"
import { useParams } from "react-router-dom"

import BoardSelect from "./BoardSelect"
import CardSelect from "./CardSelect"
import DaySelect from "./DaySelect"
import styles from "./Navbar.module.scss"

const FeatureBar = () => {
  const { boardType } = useParams()

  switch (boardType) {
    case "cards": {
      return (
        <div className={styles.board_bar}>
          <div className={styles.board_select}>
            <BoardSelect type={boardType} />
          </div>

          <div className={styles.card_select}>
            <CardSelect />
          </div>
        </div>
      )
    }
    case "itineraries": {
      return (
        <div className={styles.board_bar}>
          <div className={styles.board_select}>
            <BoardSelect type={boardType} />
          </div>
          <div className={`${styles.daySelect_container} ${styles.tooltip}`}>
            <DaySelect />
            <div style={{ width: "90px" }} className={styles.tooltip_text}>
              選擇起始日期
            </div>
          </div>
        </div>
      )
    }

    default: {
      return null
    }
  }
}

export default FeatureBar
