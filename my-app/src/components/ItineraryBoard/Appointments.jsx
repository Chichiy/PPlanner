import React, { useEffect } from "react"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { useRouteMatch, useHistory } from "react-router-dom"
import styles from "./ItineraryBoard.module.scss"
import DayJS from "react-dayjs"
import { colorCode } from "../../utils/lib"
import { responsiveTime } from "../../utils/itineraryBoardLib"
import IsDraggingUser from "./IsDraggingUser"
import { useWindowSize } from "../../utils/customHooks"

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

    const windowSize = useWindowSize()

    const style = (card, snapshot, provided, type) => {
      let day = new Date(card.start_time)
      let dayIndex = Math.floor((day - startDate) / 24 / 60 / 60 / 1000)

      let startTime = day.getHours() * 2 + (day.getMinutes() >= 30 ? 1 : 0) + 1

      let endTime = new Date(card.end_time)
      let timeSpan = Math.ceil((endTime.getTime() - day.getTime()) / 60000 / 30)
      let temp
      let appointments
      let timeTableResize
      let mobileMode
      let resizeWidth

      //resize when view change
      try {
        mobileMode = windowSize.width < 700
        appointments = mobileMode ? windowSize.width : windowSize.width - 200
        timeTableResize = appointments * 0.055 < 46
        resizeWidth = (appointments - 45.6) / 7
      } catch {
        timeTableResize = false
      }

      switch (type) {
        case "sensor": {
          temp = {
            width: timeTableResize ? `${resizeWidth}px` : "13.5%",
            height: `20px`,

            position: "absolute",
            top: `${startTime * 20 - 20}px`,
            left: timeTableResize
              ? `${resizeWidth * dayIndex + 45.6 - 2}px`
              : `${dayIndex * 13.5 + 5.5}%`,
            ...provided.draggableProps.style,
          }

          break
        }
        case "display": {
          temp = {
            height: `${timeSpan * 20}px`,

            //display blocking card when other is dragging
            backgroundColor: card.isDragging
              ? colorCode[`${card.category}_shade`]
              : colorCode[card.category],
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
      <Droppable droppableId="appointments" isDropDisabled={true}>
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
                <Draggable
                  key={card.id}
                  draggableId={card.id}
                  index={index}
                  isDragDisabled={card.isDragging ? true : false}
                >
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.draggableProps}
                        id={card.id}
                        style={style(card, snapshot, provided, "sensor")}
                        ref={provided.innerRef}
                        data-cardid={card.id}
                      >
                        <div
                          data-displayid={card.id}
                          style={style(card, snapshot, provided, "display")}
                          className={styles.appointment_display}
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
                          {card.isDragging && (
                            <IsDraggingUser isDragging={card.isDragging} />
                          )}
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
