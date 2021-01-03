import React from "react"
import styles from "./CardBoard.module.scss"
import DayJS from "react-dayjs"

const SavedDate = ({ date }) => {
  return date ? (
    <div className={styles.small_card_icon__status}>
      <DayJS format="MM/DD">{date}</DayJS>
    </div>
  ) : null
}

const MemorizeSavedDate = React.memo(SavedDate)
export default MemorizeSavedDate
