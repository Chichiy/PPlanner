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
import { modifyCardProperties, updateCardsOrder } from "../CardBoard/cardSlice"
import LargeCard from "../CardBoard/component/LargeCard"

const ItineraryBoard = () => {
  let { itineraryId, projectId } = useParams()

  console.log("rerender!!!!!")
  //needed state
  const itinerary = useSelector((state) => state.itinerary)
  // const dayplans = useSelector((state) => state.dayplans)
  const cards = useSelector((state) => state.cards)

  const [filterMethod] = useState("status")

  const filterCards = (filterMethod) => {
    switch (filterMethod) {
      case "noPlan": {
        return cards.filter((card) => card.status === 0)
      }

      case "withPlan": {
        return cards.filter((card) => card.status === 1)
      }

      case "noFilter": {
        return cards
      }

      default: {
        return cards
      }
    }
  }

  // //register needed dispatch
  const dispatch = useDispatch()

  const handleOnDragEnd = (result) => {
    console.log(result)
    // OnDragEnd(dispatch, result, itinerary, filterCards)

    //define type
    let type
    let sou = result.source.droppableId
    let des = result.destination.droppableId

    if (sou === "cardsList" && des === "cardsList") {
      type = "reorderCards"
    }
    if (sou === "cardsList" && des !== "cardsList") {
      type = "addAppointment"
    }
    if (sou === "appointments" && des !== "cardsList") {
      type = "rescheduleAppointment"
    }
    if (sou === "appointments" && des === "cardsList") {
      type = "removeAppointment"
    }

    switch (type) {
      case "reorderCards": {
        let destinationId = filterCards("noPlan")[result.destination.index].id
        let updateAction = updateCardsOrder({
          type: "cardsList",
          result: result,
          destinationId: destinationId,
        })
        dispatch(updateAction)
        break
      }

      case "rescheduleAppointment": {
        //get target item
        let targetCardId = result.draggableId
        let target = cards.find((card) => card.id === targetCardId)

        //get original data
        let startTime = new Date(target.start_time)
        let endTime = new Date(target.end_time)
        let timeSpan = endTime.getTime() - startTime.getTime()

        //get new data
        let newStartTime = new Date()
        newStartTime.setTime(result.destination.droppableId)
        let newEndTime = new Date()
        newEndTime.setTime(newStartTime.getTime() + timeSpan)

        //check if change
        if (
          startTime.getTime() === newStartTime.getTime() &&
          endTime.getTime() === newEndTime.getTime()
        ) {
          break
        }

        //prepare changes
        let change = {
          start_time: newStartTime,
          end_time: newEndTime,
        }
        let convertedChange = {
          start_time: newStartTime.toString(),
          end_time: newEndTime.toString(),
        }

        //update locally first
        dispatch(
          modifyCardProperties({ change: convertedChange, id: targetCardId })
        )
        //update to cloud database
        updateCard_Fs(projectId, targetCardId, change)
        break
      }

      case "addAppointment": {
        //get target item
        let targetCardId = result.draggableId

        //get new data
        let newStartTime = new Date()
        newStartTime.setTime(result.destination.droppableId)
        let newEndTime = new Date()
        newEndTime.setTime(newStartTime.getTime() + 60 * 60 * 1000)

        //prepare changes
        let change = {
          status: 1,
          start_time: newStartTime,
          end_time: newEndTime,
        }
        let convertedChange = {
          status: 1,
          start_time: newStartTime.toString(),
          end_time: newEndTime.toString(),
        }

        //update locally first
        dispatch(
          modifyCardProperties({ change: convertedChange, id: targetCardId })
        )
        //update to cloud database
        updateCard_Fs(projectId, targetCardId, change)

        break
      }

      case "removeAppointment": {
        //get target item
        let targetCardId = result.draggableId

        //prepare changes
        let change = {
          status: 0,
          start_time: null,
          end_time: null,
        }
        let convertedChange = {
          status: 0,
          start_time: null,
          end_time: null,
        }

        //update locally first
        dispatch(
          modifyCardProperties({ change: convertedChange, id: targetCardId })
        )
        //update to cloud database
        updateCard_Fs(projectId, targetCardId, change)

        break
      }

      default: {
        console.log("something wrong when drag and drop")
        break
      }
    }
  }

  const handleOnDragStart = (result) => {
    console.log(result)
  }

  const match = useRouteMatch()
  return (
    <div className={styles.view}>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <CardList cards={filterCards("noPlan")} />
        <Dayplans />
      </DragDropContext>

      <Switch>
        <Route path={`${match.path}/:cardId`}>
          <LargeCard />
        </Route>
      </Switch>
    </div>
  )
}

export default ItineraryBoard
