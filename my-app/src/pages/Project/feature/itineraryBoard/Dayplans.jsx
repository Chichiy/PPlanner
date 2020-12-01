//tools
import React from "react"
import { useSelector } from "react-redux"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"

//components and scss
import styles from "../../../../scss/itineraryBoard.module.scss"

const Dayplans = () => {
  //needed state
  const dayplans = useSelector((state) => state.dayplans)
  const cards = useSelector((state) => state.cards)

  const getCardTitle = (id) => {
    let target = cards.find((item) => item.id === id)
    return target ? target.title : null
  }

  return (
    <div id="itineraryBoard" className={styles.itineraryBoard}>
      <div className={styles.container}>
        <div className={styles.year}>
          <span>2020</span>
        </div>
        <div className={styles.morning}>
          <span>上午</span>
        </div>
        <div className={styles.afternoon}>
          <span>下午</span>
        </div>
        <div className={styles.evening}>
          <span>晚上</span>
        </div>
        <div className={styles.hotel}>
          <span>住房</span>
        </div>
        <div className={styles.date_1}>
          <span>12/28 (MON.)</span>
        </div>
        <div className={styles.date_2}>
          <span>12/29 (TUE.)</span>
        </div>

        {dayplans.map((dayplan, index) => {
          if (dayplan.id) {
            return (
              <Droppable key={nanoid()} droppableId={dayplan.id}>
                {(provided) => (
                  <div
                    className={styles[`dayplan_${index + 1}`]}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {dayplan.schedule.map((card, index) => {
                      if (card.card_id) {
                        return (
                          <Draggable
                            key={card.card_id}
                            draggableId={card.card_id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className={styles.card}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <div className={styles.cardTitle}>
                                  {getCardTitle(card.card_id)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      }
                      return null
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default Dayplans
