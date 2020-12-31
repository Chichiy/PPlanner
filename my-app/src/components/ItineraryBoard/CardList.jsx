import React, { useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import styles from "./ItineraryBoard.module.scss"
import { colorCode } from "../../utils/lib"
import { responsiveTime } from "../../utils/itineraryBoardLib"

const CardList = (props) => {
  // filiter's state
  const [isShowing, setShowing] = useState(false)
  const [filter, setFilter] = useState([
    "activity",
    "commute",
    "default",
    "food",
    "hotel",
    "site",
  ])

  const handleChangeFilter = (e) => {
    if (e.target.checked) {
      //add option in filiter
      setFilter((prev) => [...prev, e.target.name])
    } else {
      //remove option from filiter
      let newFiliter = filter.filter((option) => option !== e.target.name)
      setFilter(newFiliter)
    }
  }

  const filteredCards = () => {
    return props.cards.filter((card) => filter.includes(card.category))
  }

  //isDragging's styles
  const isDraggingStyle = (card, snapshot, provided) => {
    let isDraggingOver = document.querySelector(
      `[data-rbd-droppable-id="${snapshot.draggingOver}"]`
    )

    // if (snapshot.isDragging && isDraggingOver) {
    let droppableWidth = isDraggingOver.getBoundingClientRect().width

    let style = {
      ...provided.draggableProps.style,
      padding: "6px",
      boxSizing: "border-box",
      borderRadius: "5px",
      height: "40px",
      backgroundColor: colorCode[card.category],
      width: droppableWidth,
    }
    return style
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_space}></div>

      {/* cards filter */}
      <div className={styles.sidebar_filter}>
        <div
          className={
            isShowing
              ? styles.sidebar_filter__title
              : `${styles.sidebar_filter__title} ${styles.filter_close}`
          }
          onClick={() => {
            setShowing(!isShowing)
          }}
        >
          篩選
        </div>
        <div
          className={styles.sidebar_filter__list}
          style={
            isShowing
              ? null
              : {
                  padding: "0px 10px",
                  height: "0px",
                  visibility: "hidden",
                  transition:
                    "visibility 0s 1s,  height 1s ease-in-out, padding 0.7s 0.3s ease-in",
                }
          }
        >
          <label className={styles.label__hotel}>
            <input
              type="checkbox"
              name="hotel"
              id="hotel"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}> </div>
            <span>住宿</span>
          </label>
          <label className={styles.label__activity}>
            <input
              type="checkbox"
              name="activity"
              id="activity"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}></div> <span>活動</span>
          </label>
          <label className={styles.label__site}>
            <input
              type="checkbox"
              name="site"
              id="site"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}> </div>
            <span>景點</span>
          </label>

          <label className={styles.label__food}>
            <input
              type="checkbox"
              name="food"
              id="food"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}> </div>
            <span>食物</span>
          </label>
          <label className={styles.label__commute}>
            <input
              type="checkbox"
              name="commute"
              id="commute"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}></div> <span>交通</span>
          </label>

          <label className={styles.label__default}>
            <input
              type="checkbox"
              name="default"
              id="default"
              defaultChecked
              onChange={handleChangeFilter}
            />
            <div className={styles.checkmark}></div>
            <span>預設</span>
          </label>
        </div>
      </div>

      {/* cards list */}
      <div className={styles.sidebar_cards}>
        <div className={styles.sidebar_cards__title}>待定行程</div>
        <Droppable droppableId={"cardsList"}>
          {(provided) => (
            <div
              id="cardList"
              className={styles.cardList}
              // onClick={handleAddCard}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredCards().map((card, index) => {
                return (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          id={card.id}
                          className={
                            snapshot.draggingOver &&
                            snapshot.draggingOver !== "cardsList"
                              ? null
                              : styles.card
                          }
                          style={
                            snapshot.draggingOver &&
                            snapshot.draggingOver !== "cardsList"
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
                              snapshot.draggingOver &&
                              snapshot.draggingOver !== "cardsList"
                                ? styles.appointment_title
                                : styles.title
                            }
                            style={
                              snapshot.draggingOver &&
                              snapshot.draggingOver !== "cardsList"
                                ? { fontSize: "12px" }
                                : null
                            }
                          >
                            {card.title}
                          </div>
                          {snapshot.draggingOver &&
                          snapshot.draggingOver !== "cardsList"
                            ? responsiveTime(card, snapshot)
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

export default CardList
