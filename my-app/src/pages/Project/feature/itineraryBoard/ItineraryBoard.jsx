//tools
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"

//components and scss

import CardList from "./CardList"
import Dayplans from "./Dayplans"
import styles from "../../../../scss/itineraryBoard.module.scss"

//functions
import { OnDragEnd } from "./itineraryBoardLib"
import { updateCard_Fs } from "../../../../firebase/Config"

const ItineraryBoard = () => {
  let { itineraryId, projectId } = useParams()

  //needed state
  const itinerary = useSelector((state) => state.itinerary)
  // const dayplans = useSelector((state) => state.dayplans)
  const cards = useSelector((state) => state.cards)

  const [filterMethod] = useState("status")

  const filterCards = () => {
    switch (filterMethod) {
      default: {
        return cards.filter((card) => card.status === 0)
      }
    }
  }

  // //register needed dispatch
  const dispatch = useDispatch()

  const handleOnDragEnd = (result) => {
    console.log("dragend")
    // OnDragEnd(dispatch, result, itinerary, filterCards)
    let targetCardId = result.draggableId
    let target = cards.find((card) => card.id === targetCardId)
    let startTime = new Date(target.start_time)
    let endTime = new Date(target.end_time)
    let timeSpan = endTime.getTime() - startTime.getTime()
    let newStartTime = new Date()
    newStartTime.setTime(result.destination.droppableId)
    let newEndTime = new Date()
    newEndTime.setTime(newStartTime.getTime() + timeSpan)

    let change = {
      start_time: newStartTime,
      end_time: newEndTime,
    }

    updateCard_Fs(projectId, targetCardId, change)
  }
  const handleOnDragStart = (result) => {
    console.log(result)
  }

  return (
    <div className={styles.view}>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <CardList cards={filterCards()} />
        <Dayplans />
      </DragDropContext>
    </div>
  )
}

export default ItineraryBoard
