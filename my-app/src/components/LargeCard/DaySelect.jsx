import React from "react"
import { useSelector } from "react-redux"

import styles from "./LargeCard.module.scss"

//DatesPicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const DaySelect = ({ date, setDate }) => {
  //show dates with plans
  const plannedCards = useSelector((state) => state.cards).filter(
    (card) => card.status === 1
  )

  const getDate = (type, string) => {
    switch (type) {
      case "dateObj": {
        let time = new Date(string)
        return time
      }

      case "date": {
        let time = new Date(string)
        return time.getDate()
      }
      case "month": {
        let time = new Date(string)
        return time.getMonth()
      }
      case "year": {
        let time = new Date(string)
        return time.getFullYear()
      }
      default: {
        break
      }
    }
  }

  const hasPlan = (date) => {
    if (
      plannedCards.findIndex(
        (card) =>
          getDate("dateObj", card.start_time) - date < 24 * 60 * 60 * 1000 &&
          getDate("dateObj", card.start_time) - date > 0
      ) > -1
    ) {
      return true
    } else {
      return false
    }
  }

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
      dayClassName={(date) => (hasPlan(date) ? styles.hasPlan : undefined)}
    />
  )
}

export default DaySelect
