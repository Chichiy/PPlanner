import React, { useEffect } from "react"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { useRouteMatch, useHistory } from "react-router-dom"
import styles from "./ItineraryBoard.module.scss"
import DayJS from "react-dayjs"
import { colorCode } from "../../utils/lib"
import { responsiveTime } from "../../utils/itineraryBoardLib"
import IsDraggingUser from "./IsDraggingUser"

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

export default Appointments
