import React, { useState } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import { Draggable, Droppable } from "react-beautiful-dnd"
import styles from "./ItineraryBoard.module.scss"
import { colorCode, categories } from "../../utils/lib"
import { responsiveTime } from "../../utils/itineraryBoardLib"
import PendingCardsFilter from "./PendingCardsFilter"
import { useWindowSize } from "../../utils/customHooks"
import AppointmentTime from "./AppointmentTime"

const Sidebar = () => {
  const windowSize = useWindowSize()
  const [isShowing, setShowing] = useState(window.innerWidth > 700)
  const [filter, setFilter] = useState(categories)

  const selectFilteredCards = createSelector(
    (state) => state.cards,
    (cards) =>
      cards.filter(
        (card) => card.status === 0 && filter.includes(card.category)
      )
  )
  const filteredCards = useSelector(selectFilteredCards)

  //isDragging's styles
  const isDraggingStyle = (card, snapshot, provided) => {
    let isDraggingOver = document.querySelector(
      `[data-rbd-droppable-id="${snapshot.draggingOver}"]`
    )

    let droppableWidth = isDraggingOver.getBoundingClientRect().width

    let style = {
      ...provided.draggableProps.style,
      width: droppableWidth,
      height: "40px",
      padding: "2px 6px",
      boxSizing: "border-box",
      borderRadius: "5px",
      overflow: "hidden",
      backgroundColor: colorCode[card.category],
    }
    return style
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_title}>
        待定行程
        <div
          className={
            isShowing
              ? styles.sidebar_filter_icon__open
              : styles.sidebar_filter_icon
          }
          onClick={() => {
            setShowing(!isShowing)
          }}
        />
      </div>
      <PendingCardsFilter
        filter={filter}
        setFilter={setFilter}
        isShowing={isShowing}
      />

      <div className={styles.sidebar_cards_container}>
        <Droppable
          droppableId={"cardsList"}
          direction={windowSize.width > 700 ? "vertical" : "horizontal"}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              id="cardList"
              className={styles.card_list}
              ref={provided.innerRef}
            >
              {filteredCards.map((card, index) => {
                return (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => {
                      const isOutside =
                        snapshot.draggingOver &&
                        snapshot.draggingOver !== "cardsList"

                      return (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          id={card.id}
                          className={isOutside ? null : styles.card}
                          style={
                            isOutside
                              ? isDraggingStyle(card, snapshot, provided)
                              : provided.draggableProps.style
                          }
                        >
                          <div
                            className={styles.category}
                            style={{
                              backgroundColor: colorCode[card.category],
                            }}
                          ></div>
                          <div
                            className={
                              isOutside
                                ? styles.appointment_title__pending
                                : styles.title
                            }
                            style={isOutside ? { fontSize: "12px" } : null}
                          >
                            {card.title}
                          </div>
                          {isOutside
                            ? responsiveTime(AppointmentTime, card, snapshot)
                            : null}
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
      </div>
    </div>
  )
}

export default Sidebar
