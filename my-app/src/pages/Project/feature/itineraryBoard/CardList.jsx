//tools
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"

//components and scss
import styles from "../../../../scss/itineraryBoard.module.scss"

//functions
import { addCard } from "../CardBoard/cardSlice"
import { colorCode } from "../../../lib"
import { responsiveTime } from "./itineraryBoardLib"

const CardList = (props) => {
  //dispatch
  const dispatch = useDispatch()

  const handleAddCard = (e) => {
    if (e.target.id === "cardList") {
      let card = {
        title: "test" + nanoid(3),
        id: nanoid(),
        status: 0,
      }
      dispatch(addCard(card))
    }
  }
  // filiter's state
  const [isShowing, setShowing] = useState(false)

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
          <label>
            <input
              type="checkbox"
              name="activity"
              id="activity"
              defaultChecked
            />
            <div className={styles.checkmark}></div> <span>活動</span>
          </label>
          <label>
            <input type="checkbox" name="commute" id="commute" defaultChecked />
            <div className={styles.checkmark}></div> <span>交通</span>
          </label>
          <label>
            <input type="checkbox" name="food" id="food" defaultChecked />
            <div className={styles.checkmark}> </div>
            <span>食物</span>
          </label>
          <label>
            <input type="checkbox" name="hotel" id="hotel" defaultChecked />
            <div className={styles.checkmark}> </div>
            <span>住宿</span>
          </label>
          <label>
            <input type="checkbox" name="site" id="site" defaultChecked />
            <div className={styles.checkmark}> </div>
            <span>景點</span>
          </label>
          <label>
            <input type="checkbox" name="default" id="default" defaultChecked />
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
              {props.cards.map((card, index) => {
                return (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => {
                      console.log(snapshot.draggingOver)

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
