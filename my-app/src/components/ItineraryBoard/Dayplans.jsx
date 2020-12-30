// tools
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
import styles from "./ItineraryBoard.module.scss"

import DayJS from "react-dayjs"
import { getDateHeader, colorCode, resetTime, getColor } from "../../utils/lib"
import { responsiveTime } from "../../utils/itineraryBoardLib"
import { modifyCardProperties } from "../../app/slices/cardSlice"
import { updateCard_Fs } from "../../firebase/Config"

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

  //expand edit feature
  const { projectId } = useParams()
  const [isExpanding, setExpanding] = useState(false)
  const dispatch = useDispatch()

  const handleExpandStart = (e) => {
    if (e.target.ariaLabel === "lower") {
      setExpanding(e.target.dataset.cardid)
    }
  }

  const handleExpandEnd = () => {
    //check if isExpanding
    if (isExpanding) {
      //get target size and position
      let targetCardId = isExpanding
      let target = document.querySelector(`[data-displayid="${targetCardId}"]`)
      let targetHeight = target.getBoundingClientRect().height

      //per 30 mins
      let timeSpan =
        targetHeight % 20 < 11
          ? Math.floor(targetHeight / 20)
          : Math.ceil(targetHeight / 20)

      //get original data
      let targetData = cards.find((card) => card.id === targetCardId)
      let startTime = new Date(targetData.start_time)
      let newEndTime = new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)

      //prepare changes
      let change = {
        end_time: newEndTime,
      }
      let convertedChange = {
        end_time: newEndTime.toString(),
      }

      //update locally first
      dispatch(
        modifyCardProperties({ change: convertedChange, id: targetCardId })
      )
      //update to cloud database
      updateCard_Fs(projectId, targetCardId, change)

      //turn off listening
      setExpanding(false)
    }
  }

  const handlePosition = (e) => {
    //listen to mousemove
    if (isExpanding) {
      //mouse position
      let mousePosition = e.clientY

      //get target size and position
      let targetId = isExpanding
      let target = document.querySelector(`[data-displayid="${targetId}"]`)
      let targetPosition = target.getBoundingClientRect()

      //new height (10px for buffer)
      let rawHeight = mousePosition - targetPosition.top + 10

      let timeSpan =
        rawHeight % 20 < 11
          ? Math.floor(rawHeight / 20)
          : Math.ceil(rawHeight / 20)
      let newHeight = timeSpan * 20

      //at least need to be longer than 20px (30mins)
      if (newHeight > 19) {
        target.style.height = `${newHeight}px`
      }

      //update end time display
      let endTimeElement = target.querySelector(
        `time[aria-label="expandEndTime"]`
      )
      let startTime = new Date(
        cards.find((card) => card.id === targetId).start_time
      )
      let newEndTime = new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)

      endTimeElement.textContent = `${
        newEndTime.getHours() < 10
          ? `0${newEndTime.getHours()}`
          : newEndTime.getHours()
      }:${newEndTime.getMinutes() < 30 ? `00` : "30"}`
    }
  }

  return (
    <div id="itineraryBoard" className={styles.itineraryBoard}>
      <TimeTable
        startDate={startDate}
        cards={cards}
        handleExpandEnd={handleExpandEnd}
        handlePosition={handlePosition}
      />
      <Appointments
        startDate={startDate}
        cards={cards}
        isExpanding={isExpanding}
        handleExpandStart={handleExpandStart}
        handleExpandEnd={handleExpandEnd}
        handlePosition={handlePosition}
      />
    </div>
  )
}

export default Dayplans

////// Appointment //////
const Appointments = React.memo(
  ({
    startDate,
    cards,
    isExpanding,
    handleExpandStart,
    handleExpandEnd,
    handlePosition,
  }) => {
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

    const style = (card, snapshot, provided, type) => {
      let day = new Date(card.start_time)
      let dayIndex = Math.floor((day - startDate) / 24 / 60 / 60 / 1000)

      let startTime = day.getHours() * 2 + (day.getMinutes() >= 30 ? 1 : 0) + 1

      let endTime = new Date(card.end_time)
      let timeSpan = Math.ceil((endTime.getTime() - day.getTime()) / 60000 / 30)
      let temp
      let appointments
      let resize
      let resizeWidth

      //resize when view change
      try {
        appointments = document
          .querySelector("#appointments")
          .getBoundingClientRect()
        resize = appointments.width * 0.055 < 45
        resizeWidth = (appointments.width - 45) / 7
      } catch {
        resize = false
      }

      switch (type) {
        case "sensor": {
          // temp = {
          //   padding: "6px",
          //   boxSizing: "border-box",
          //   position: "absolute",
          //   borderRadius: "5px",
          //   border: "2px solid white",
          //   cursor: "pointer",

          //   backgroundColor: colorCode[card.category],
          //   top: `${startTime * 20 - 20}px`,
          //   left: resize
          //     ? `${resizeWidth * dayIndex + 45}px`
          //     : `${dayIndex * 13.5 + 5.5}%`,
          //   width: resize ? `${resizeWidth}px` : "13.5%",
          //   height: `${timeSpan * 20}px`,
          //   ...provided.draggableProps.style,
          // }

          temp = {
            position: "absolute",

            top: `${startTime * 20 - 20}px`,
            left: resize
              ? `${resizeWidth * dayIndex + 45}px`
              : `${dayIndex * 13.5 + 5.5}%`,
            width: resize ? `${resizeWidth}px` : "13.5%",
            height: `20px`,
            ...provided.draggableProps.style,
          }

          break
        }
        case "display": {
          temp = {
            padding: "2px 6px",
            boxSizing: "border-box",
            position: "absolute",
            borderRadius: "5px",
            border: "2px solid white",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: colorCode[card.category],
            top: "0",
            left: "0",
            width: "100%",
            height: `${timeSpan * 20}px`,
          }

          //display blocking card when other is dragging
          if (card.isDragging) {
            temp.backgroundColor = colorCode[`${card.category}_shade`]
          }

          break
        }
        default: {
          break
        }
      }

      //fix position
      if (!snapshot.isDragging) temp.transform = "translateX(1px)"

      return dayIndex > -1 && dayIndex < 7 ? temp : { display: "none" }
    }

    const history = useHistory()
    const match = useRouteMatch()
    const handleShowCard = (e) => {
      history.push(`${match.url}/${e.target.dataset.cardid}`)
    }

    useEffect(() => {}, [])

    return (
      <Droppable
        key={nanoid()}
        droppableId="appointments"
        isDropDisabled={true}
      >
        {(provided) => (
          <div
            id="appointments"
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.appointments}
            onMouseDown={handleExpandStart}
            onMouseUp={handleExpandEnd}
            onMouseMove={handlePosition}
          >
            {cardHasPlan.map((card, index) => {
              return (
                <Draggable key={nanoid()} draggableId={card.id} index={index}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.draggableProps}
                        id={card.id}
                        style={style(card, snapshot, provided, "sensor")}
                        ref={provided.innerRef}
                        data-cardid={card.id}
                        isDragDisabled={card.isDragging ? true : false}
                      >
                        <div
                          data-displayid={card.id}
                          style={style(card, snapshot, provided, "display")}
                        >
                          <div
                            className={styles.appointment_title}
                            data-cardid={card.id}
                          >
                            {card.title}
                          </div>
                          {responsiveTime(card, snapshot, isExpanding)}

                          <div
                            aria-label="upper"
                            data-cardid={card.id}
                            className={styles.expandHandle_upper}
                            {...provided.dragHandleProps}
                            onClick={handleShowCard}
                          ></div>

                          {/* expand handle */}

                          <div
                            aria-label="lower"
                            data-cardid={card.id}
                            className={styles.expandHandle_lower}
                          ></div>
                          <IsDraggingUser isDragging={card.isDragging} />
                        </div>
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
  }
)

const IsDraggingUser = ({ isDragging }) => {
  const members = useSelector((state) => state.members)
  const isDraggingUser = members.find((member) => member.id === isDragging)
  if (isDragging) {
    return (
      <div
        className={styles.isDragging_user}
        style={{
          backgroundColor: getColor(isDragging),
        }}
      >
        {isDraggingUser.name[0]}
      </div>
    )
  } else {
    return null
  }
}

////// Time Table //////
const TimeTable = React.memo(
  ({ startDate, cards, handleExpandEnd, handlePosition }) => {
    console.log(startDate)
    const datesHeader = () => {
      let temp = []
      for (let i = 0; i < 8; i++) {
        if (i === 0) {
          temp.push(
            <td className={styles.datesHeader_space} key={nanoid()}></td>
          )
        } else {
          let date = new Date(
            startDate.getTime() + (i - 1) * 24 * 60 * 60 * 1000
          )

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
)
