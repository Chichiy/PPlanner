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

const ItineraryBoard = () => {
  let { itineraryId } = useParams()

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

  const handleOnDragEnd = (result) =>
    OnDragEnd(dispatch, result, itinerary, filterCards)

  return (
    <div className={styles.view}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <CardList cards={filterCards()} />
        <Dayplans />
      </DragDropContext>
    </div>
  )
}

export default ItineraryBoard
