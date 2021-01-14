//tools
import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Switch, Route, useParams } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"

//components and scss

import Sidebar from "./Sidebar"
import Schedule from "./Schedule"
import styles from "./ItineraryBoard.module.scss"

//functions
import { OnDragEnd } from "../../utils/itineraryBoardLib"
import { updateCard_Fs } from "../../firebase/Config"
import {
  modifyCardProperties,
  updateCardsOrder,
} from "../../redux/slices/cardSlice"
import LargeCard from "../LargeCard/LargeCard"

const ItineraryBoard = () => {
  const { projectId } = useParams()
  const cards = useSelector((state) => state.cards)

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
    const isValidDrop = result.destination

    if (isValidDrop) {
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
          //check if change
          if (result.source.index === result.destination.index) {
            break
          }

          let destinationId = filterCards("noPlan")[result.destination.index].id
          let updateAction = updateCardsOrder({
            type: "cardsList",
            result: result,
            destinationId: destinationId,
          })
          dispatch(updateAction)

          let change = {
            isDragging: false,
          }
          //update to cloud database
          updateCard_Fs(projectId, result.draggableId, change)
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
            //prepare changes
            let change = {
              isDragging: false,
            }

            //update to cloud database to cancel isDragging
            updateCard_Fs(projectId, targetCardId, change)
            break
          }

          //prepare changes
          let change = {
            start_time: newStartTime,
            end_time: newEndTime,
            isDragging: false,
          }
          let convertedChange = {
            start_time: newStartTime.toString(),
            end_time: newEndTime.toString(),
            isDragging: false,
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
            isDragging: false,
          }
          let convertedChange = {
            status: 1,
            start_time: newStartTime.toString(),
            end_time: newEndTime.toString(),
            isDragging: false,
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
            isDragging: false,
          }
          let convertedChange = {
            status: 0,
            start_time: null,
            end_time: null,
            isDragging: false,
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
          console.log("invalid drag and drop")

          // still need to turn off notification
          let targetCardId = result.draggableId
          let change = {
            isDragging: false,
          }
          let convertedChange = {
            isDragging: false,
          }

          //update locally first
          dispatch(
            modifyCardProperties({ change: convertedChange, id: targetCardId })
          )
          //update to cloud database
          updateCard_Fs(projectId, targetCardId, change)

          break
        }
      }
    } else {
      // invalid drop
      // still need to turn off notification
      let targetCardId = result.draggableId
      let change = {
        isDragging: false,
      }
      let convertedChange = {
        isDragging: false,
      }

      //update locally first
      dispatch(
        modifyCardProperties({ change: convertedChange, id: targetCardId })
      )
      //update to cloud database
      updateCard_Fs(projectId, targetCardId, change)
    }
  }

  const user = useSelector((state) => state.user)

  const handleOnDragStart = (result) => {
    //register dragger's info on cloud data to prevent re-writes
    let targetCardId = result.draggableId
    let userId = user.id

    //prepare changes
    let change = {
      isDragging: userId,
    }

    //update to cloud database with blocking listening again
    updateCard_Fs(projectId, targetCardId, change)
  }

  return (
    <div className={styles.view}>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <Sidebar />
        <Schedule />
      </DragDropContext>

      <Switch>
        <Route path={`/projects/:projectId/:boardType/:cardId`}>
          <LargeCard />
        </Route>
      </Switch>
    </div>
  )
}

export default ItineraryBoard
