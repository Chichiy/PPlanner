import React from "react"
import { useSelector } from "react-redux"
import styles from "./LargeCard.module.scss"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { hasPlan } from "../../utils/lib"

const DaySelect = ({ date, setDate }) => {
  //show dates with plans
  const plannedCards = useSelector((state) => state.cards).filter(
    (card) => card.status === 1
  )

  return (
    <DatePicker
      ariaLabelledBy="addTime"
      selected={date}
      onChange={(date) => setDate(date)}
      className={styles.input}
      showTimeSelect
      dateFormat="Pp"
      popperClassName={styles.popper}
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "-10px, -5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: true,
          boundariesElement: "viewport",
        },
      }}
      wrapperClassName={styles.react_datepicker_wrapper}
      dayClassName={(date) => hasPlan(plannedCards, date) && styles.hasPlan}
    />
  )
}

export default DaySelect
