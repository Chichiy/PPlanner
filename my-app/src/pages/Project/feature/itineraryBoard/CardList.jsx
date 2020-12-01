//tools
import React from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"

//components and scss
import styles from "../../../../scss/itineraryBoard.module.scss"

//functions
import { addCard } from "../CardBoard/cardSlice"

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

  return (
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
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    id={card.id}
                    className={styles.card}
                  >
                    <div className={styles.cardTitle}>{card.title}</div>
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
}

export default CardList
