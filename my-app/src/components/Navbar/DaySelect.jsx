import React, { useState, useEffect, useRef } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./react-datepicker-customstyle.scss"
import styles from "./Navbar.module.scss"

import { getPureDate, hasPlan } from "../../utils/lib"

const DaySelect = () => {
  const history = useHistory()
  const location = useLocation()
  const selectPlannedCards = createSelector(
    (state) => state.cards,
    (cards) => cards.filter((card) => card.status === 1)
  )
  const plannedCards = useSelector(selectPlannedCards)
  const [startDate, setStartDate] = useState(getPureDate(new Date()))
  const newStartDate = useRef(null)

  const handleDateChange = (date) => {
    const newLocation = {
      pathname: location.pathname,
      state: { startDate: date },
    }
    newStartDate.current = date
    history.replace(newLocation)
  }

  useEffect(() => {
    const findFirstDate = (cards) => {
      const startTimes = cards.map((card) =>
        new Date(card.start_time).getTime()
      )
      return getPureDate(new Date(Math.min(...startTimes)))
    }

    if (newStartDate.current !== startDate) {
      //firstly, display with chosen date
      if (location.state?.startDate) {
        newStartDate.current = location.state.startDate
        setStartDate(location.state.startDate)
      } else if (
        //if not, display date with first planned card
        plannedCards.length > 0 &&
        newStartDate.current !== findFirstDate(plannedCards)
      ) {
        const firstDate = findFirstDate(plannedCards)
        newStartDate.current = firstDate
        handleDateChange(firstDate)
      }
      // otherwise, display with today by using default state
    }
  }, [location.state, plannedCards])

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => handleDateChange(date)}
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
      dayClassName={(date) => hasPlan(plannedCards, date) && styles.hasPlan}
    />
  )
}

export default DaySelect
