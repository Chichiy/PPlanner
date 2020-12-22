// tools
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"

//components and scss
import styles from "../../../../scss/itineraryBoard.module.scss"

import DayJS from "react-dayjs"
import { getDateHeader, colorCode, resetTime } from "../../../../pages/lib"
import { addDayplan_Fs } from "../../../../firebase/Config"

import { responsiveTime } from "./itineraryBoardLib"

const Dayplans = () => {
  //set start time
  const cards = useSelector((state) => state.cards)
  const location = useLocation()
  let startDate
  try {
    //get startTime from navbar through state in loaction
    startDate = location.state.startDate
  } catch {
    //if no, show today
    let temp = new Date()
    temp.setHours(0)
    temp.setMinutes(0)
    temp.setSeconds(0)
    temp.setMilliseconds(0)
    startDate = temp
  }

  return (
    <div id="itineraryBoard" className={styles.itineraryBoard}>
      <TimeTable startDate={startDate} cards={cards} />
      <Appointments startDate={startDate} cards={cards} />
    </div>
  )
}

export default Dayplans

////// Appointment //////
const Appointments = React.memo(({ startDate, cards }) => {
  const cardHasPlan = cards.filter((card) => card.status === 1)

  //display responsive time on appointment card
  const time = (card, snapshot) => {
    let hoverTime = new Date(Number(snapshot.draggingOver))
    let timeSpan = new Date(card.end_time) - new Date(card.start_time)
    let hoverEndTime = new Date(hoverTime.getTime() + timeSpan)

    if (!snapshot.isDragging) {
      return (
        <div className={styles.appointment_time}>
          <DayJS format="HH:mm">{card.start_time}</DayJS>
          <span>-</span>
          <DayJS format="HH:mm">{card.end_time}</DayJS>
        </div>
      )
    } else {
      return (
        <div className={styles.appointment_time}>
          {isNaN(hoverTime.getHours()) ? null : (
            <div>
              <time>
                {hoverTime.getHours()}:
                {hoverTime.getMinutes() < 30 ? "00" : "30"}
              </time>

              <span>-</span>

              <time>
                {hoverEndTime.getHours()}:
                {hoverEndTime.getMinutes() < 30 ? "00" : "30"}
              </time>
            </div>
          )}
        </div>
      )
    }
  }

  const style = (card, snapshot, provided) => {
    let day = new Date(card.start_time)
    let dayIndex = Math.floor((day - startDate) / 24 / 60 / 60 / 1000)

    let startTime = day.getHours() * 2 + (day.getMinutes() >= 30 ? 1 : 0) + 1

    let endTime = new Date(card.end_time)
    let timeSpan = Math.ceil((endTime.getTime() - day.getTime()) / 60000 / 30)
    let temp
    let appointments
    let resize
    let resizeWidth

    try {
      appointments = document
        .querySelector("#appointments")
        .getBoundingClientRect()
      resize = appointments.width * 0.055 < 45
      resizeWidth = (appointments.width - 45) / 7
    } catch {
      resize = false
    }

    temp = {
      padding: "6px",
      boxSizing: "border-box",
      position: "absolute",
      borderRadius: "5px",
      border: "2px solid white",

      backgroundColor: colorCode[card.category],
      top: `${startTime * 20 - 20}px`,
      left: resize
        ? `${resizeWidth * dayIndex + 45}px`
        : `${dayIndex * 13.5 + 5.5}%`,
      width: resize ? `${resizeWidth}px` : "13.5%",
      height: `${timeSpan * 20}px`,
      ...provided.draggableProps.style,
    }
    if (!snapshot.isDragging) temp.transform = "translateX(1px)"

    return dayIndex > -1 && dayIndex < 7 ? temp : { display: "none" }
  }

  return (
    <Droppable key={nanoid()} droppableId="appointments" isDropDisabled={true}>
      {(provided) => (
        <div
          id="appointments"
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.appointments}
        >
          {cardHasPlan.map((card, index) => {
            return (
              <Draggable key={nanoid()} draggableId={card.id} index={index}>
                {(provided, snapshot) => {
                  // console.log(snapshot.isDragging ? snapshot : null)
                  return (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={style(card, snapshot, provided)}
                      ref={provided.innerRef}
                    >
                      <div className={styles.appointment_title}>
                        {card.title}
                      </div>
                      {/* <div className={styles.appointment_time}>
                        {card.title}
                      </div> */}
                      {responsiveTime(card, snapshot)}
                      <div
                        className={styles.expandHandle_upper}
                        aria-label="upper"
                        // {...provided.dragHandleProps}
                      ></div>
                      <div
                        className={styles.expandHandle_lower}
                        aria-label="lower"
                      ></div>
                    </div>
                  )
                }}
              </Draggable>
            )
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
})

////// Time Table //////
const TimeTable = React.memo(({ startDate, cards }) => {
  // console.log("timetable")
  const datesHeader = () => {
    let temp = []
    for (let i = 0; i < 8; i++) {
      if (i === 0) {
        temp.push(<td className={styles.datesHeader_space} key={nanoid()}></td>)
      } else {
        let date = new Date(startDate.getTime() + (i - 1) * 24 * 60 * 60 * 1000)

        temp.push(
          <td key={nanoid()}>
            <div className={styles.datesHeader_day}>
              {getDateHeader(date, "Day")}
            </div>
            <div
              className={
                date.getTime() === resetTime(new Date()).getTime()
                  ? `${styles.datesHeader_date} ${styles.datesHeader_date__today}`
                  : styles.datesHeader_date
              }
            >
              <DayJS format="DD">{date}</DayJS>
            </div>
          </td>
        )
      }
    }
    return temp
  }

  const timeSlot = (dayIndex, timeIndex) => {
    return new Date(
      startDate.getTime() +
        dayIndex * 24 * 60 * 60 * 1000 +
        timeIndex * 30 * 60 * 1000
    )
  }

  const timeSlotShadow = ({ draggingOverWith }) => {
    let targetCard = cards.find((card) => card.id === draggingOverWith)

    let style = {
      position: "absolute",
      top: "0",
      left: "0",

      width: "100%",

      backgroundColor: "rgba(0,0,0,0.1)",
      // backgroundColor: "#e6e8e6",
      // opacity: "0.8",
      zIndex: "10",
    }

    if (targetCard.hasOwnProperty("start_time") && targetCard.start_time) {
      let startTime = new Date(targetCard.start_time)
      let endTime = new Date(targetCard.end_time)
      let timeSpan = Math.ceil((endTime - startTime) / 60000 / 30)
      style.height = `${timeSpan * 20}px`
    }
    return style
  }

  const hourHeader = (hour, i) => {
    if (hour === 0) {
      return null
    } else {
      return hour < 10 ? `0${i / 2}:00` : `${i / 2}:00`
    }
  }

  const getRow = () => {
    let rows = []
    for (let i = 0; i < 48; i++) {
      let data = []
      for (let j = 0; j < 8; j++) {
        if (j === 0) {
          if (i % 2 === 0) {
            //hour header
            let hour = i / 2
            data.push(
              <td rowSpan="2" className={styles.hourHeader} key={nanoid()}>
                {hourHeader(hour, i)}
              </td>
            )
          }
        } else {
          // time slots
          let time = timeSlot(j - 1, i)
          data.push(
            <Droppable key={nanoid()} droppableId={String(time.getTime())}>
              {(provided, snapshot) => {
                return (
                  <td
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      height: "20px",
                      position: "relative",
                      backgroundColor: snapshot.isDraggingOver
                        ? "transparent"
                        : "white",
                    }}
                    className={
                      i % 2 === 1
                        ? styles.td_border__halfHour
                        : styles.td_border__fullHour
                    }
                  >
                    {/* shadow */}
                    {snapshot.isDraggingOver && (
                      <div style={timeSlotShadow(snapshot)}></div>
                    )}
                  </td>
                )
              }}
            </Droppable>
          )
        }
      }

      rows.push(<tr key={nanoid()}>{data}</tr>)
    }
    return rows
  }

  return (
    <table>
      <tbody className={styles.tbody}>
        <tr key={nanoid()} className={styles.datesHeader_row}>
          {datesHeader()}
        </tr>
        {getRow()}
      </tbody>
    </table>
  )
})
