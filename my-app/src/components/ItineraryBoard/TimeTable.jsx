import React from "react"
import { nanoid } from "nanoid"
import { Droppable } from "react-beautiful-dnd"
import styles from "./ItineraryBoard.module.scss"
import DayJS from "react-dayjs"
import { getDateHeader, resetTime } from "../../utils/lib"

const TimeTable = ({ startDate, cards, handleExpandEnd, handlePosition }) => {
  console.log(startDate)
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
    }

    if (targetCard.hasOwnProperty("start_time") && targetCard.start_time) {
      let startTime = new Date(targetCard.start_time)
      let endTime = new Date(targetCard.end_time)
      let timeSpan = Math.ceil((endTime - startTime) / 60000 / 30)
      style.height = `${timeSpan * 20}px`
    } else {
      style.height = `40px`
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
                        : "transparent",
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
      <tbody
        className={styles.tbody}
        //handle expand
        onMouseMove={handlePosition}
        onMouseUp={handleExpandEnd}
      >
        <tr key={nanoid()} className={styles.datesHeader_row}>
          {datesHeader()}
        </tr>
        {getRow()}
      </tbody>
    </table>
  )
}

export default TimeTable
