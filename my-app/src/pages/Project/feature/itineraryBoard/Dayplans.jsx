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
import { getDateHeader } from "../../../../pages/lib"
import { addDayplan_Fs } from "../../../../firebase/Config"

const Dayplans = () => {
  const cards = useSelector((state) => state.cards)

  const location = useLocation()
  let startDate
  try {
    startDate = location.state.startDate
  } catch {
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
  // console.log("appointments")

  const cardHasPlan = cards.filter((card) => card.status === 1)

  const getCardTitle = (id) => {
    let target = cards.find((item) => item.id === id)
    return target ? target.title : null
  }

  const style = (card, snapshot, provided) => {
    let colorCode = {
      food: "#ff70a6",
      hotel: "#020887",
      country: "#ff9770",
      commute: "#71a9f7",
      site: "#ecdd7b",
      default: "#e2e1df",
    }

    let day = new Date(card.start_time)
    let dayIndex = Math.floor((day - startDate) / 24 / 60 / 60 / 1000)

    let startTime = day.getHours() * 2 + (day.getMinutes() >= 30 ? 1 : 0) + 1

    let endTime = new Date(card.end_time)
    let timeSpan = Math.ceil((endTime.getTime() - day.getTime()) / 60000 / 30)
    let temp

    temp = {
      width: "12.5%",
      padding: "10px",
      border: "1px solid #ced0ce",
      boxSizing: "border-box",

      position: "absolute",
      backgroundColor: colorCode[card.category],
      borderRadius: "5px",

      top: `${startTime * 30 - 30}px`,
      left: `${(dayIndex + 1) * 12.5}%`,
      height: `${timeSpan * 30}px`,
      ...provided.draggableProps.style,
    }

    return dayIndex > -1 && dayIndex < 7 ? temp : { display: "none" }
  }

  return (
    <Droppable
      key={nanoid()}
      droppableId={"appointments"}
      isDropDisabled={true}
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.appointments}
        >
          {cardHasPlan.map((card, index) => {
            return (
              <Draggable key={nanoid()} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={style(card, snapshot, provided)}
                    ref={provided.innerRef}
                  >
                    <div>{card.title}</div>
                  </div>
                )}
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
            <div className={styles.datesHeader_date}>
              {getDateHeader(date, "MMDD")}
            </div>

            <div className={styles.datesHeader_day}>
              {getDateHeader(date, "Day")}
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
      height: `60px`,

      backgroundColor: "#e6e8e6",
      zIndex: "10",
    }

    if (targetCard.hasOwnProperty("start_time") && targetCard.start_time) {
      let startTime = new Date(targetCard.start_time)
      let endTime = new Date(targetCard.end_time)
      let timeSpan = Math.ceil((endTime - startTime) / 60000 / 30)
      style.height = `${timeSpan * 30}px`
    }
    return style
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
                {hour < 10 ? `0${i / 2}:00` : `${i / 2}:00`}
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
                      height: "30px",
                      position: "relative",
                      backgroundColor: snapshot.isDraggingOver
                        ? "#ced0ce"
                        : "white",
                    }}
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
