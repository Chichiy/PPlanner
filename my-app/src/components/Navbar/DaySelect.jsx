import React, { useState, useEffect, useRef } from "react"
import { useRouteMatch, useLocation, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./react-datepicker-customstyle.scss"
import styles from "./Navbar.module.scss"

import { resetTime } from "../../utils/lib"

const DaySelect = () => {
  const [startDate, setStartDate] = useState(resetTime(new Date()))
  const plannedCards = useSelector((state) =>
    state.cards.filter((card) => card.status === 1)
  )

  // automacticllu set date with first planned card
  // let currentDateRange
  // if (plannedCards.length > 0) {
  //   currentDateRange = plannedCards.reduce((prev, curr) => {
  //     try {
  //       let currDate = new Date(curr.start_time)
  //       let diffDay = Math.floor((currDate - startDate) / (24 * 60 * 60 * 1000))
  //       if (diffDay > -1 && diffDay < 7) {
  //         return [...prev, ...currDate]
  //       }
  //     } catch { }
  //   }, [])
  //   console.log(currentDateRange)
  // }

  // useEffect(() => {
  //   if (plannedCards.length > 0) {
  //     // let currentDateRange = plannedCards.reduce(function (prev, curr) {
  //     //   let currDate = new Date(curr.start_time)
  //     //   let diffDay = Math.floor(((currDate - startDate) / 24) * 60 * 60 * 1000)
  //     //   if (diffDay > -1 && diffDay < 7) {
  //     //     return [...prev, ...currDate]
  //     //   }
  //     // }, [])
  //     setStartDate(resetTime(new Date(plannedCards[0].start_time)))
  //   }
  // }, [plannedCards[0]])

  //update start date through location.state
  let history = useHistory()
  let match = useRouteMatch()
  let location = useLocation()
  const previousDate = useRef()
  const handleDateChange = () => {
    location = {
      pathname: match.url,
      state: { startDate: startDate },
    }
    history.push(location)
  }
  useEffect(() => {
    if (previousDate.current !== startDate) {
      //prevent repeatly redirect
      previousDate.current = startDate
      handleDateChange()
    }
  }, [startDate])

  //show dates with plans

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

  //find current date has plan or not
  const hasPlan = (compareDate) => {
    if (
      plannedCards.findIndex(
        (card) =>
          0 < getDate("dateObj", card.start_time) - compareDate &&
          getDate("dateObj", card.start_time) - compareDate <
            24 * 60 * 60 * 1000
      ) > -1
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      className={styles.daySelect}
      dateFormat="yyyy年MM月"
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "10px, 5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: "viewport",
        },
      }}
      wrapperClassName={styles.wrapper}
      dayClassName={(date) => (hasPlan(date) ? styles.hasPlan : null)}
    />
  )
}

export default DaySelect
