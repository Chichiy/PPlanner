import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import styles from "./project.module.scss"
import Navbar from "../Navbar/Navbar"
import ItineraryBoard from "./feature/itineraryBoard/ItineraryBoard"
import CardBoard from "./feature/CardBoard/CardBoard"
import Expenditure from "./feature/Expenditure/Expenditure"
import TodoList from "./feature/TodoList/TodoList"

import {
  getFsData,
  getFsData_Cards,
  getFsData_Itinerary,
  listenToDayplans,
  listenToCard,
} from "../../firebase/Config"

import { initItinerary } from "./feature/itineraryBoard/itinerarySlice"
import {
  addDayplan,
  modifyDayplan,
  removeDayplan,
} from "./feature/itineraryBoard/dayplanSlice"
import {
  addCard,
  modifyCard,
  removeCard,
  initCards,
} from "./feature/CardBoard/cardSlice"

const Project = () => {
  console.log("rerender Project component")

  let { projectId } = useParams()
  let match = useRouteMatch()
  let projects = useSelector((state) => state.projects)
  let itineraryId = useSelector((state) => state.itinerary.id)
  const dispatch = useDispatch()

  const handleAddDayplan = (res) => {
    dispatch(addDayplan(res))
  }

  const handleModifyDayplan = (res) => {
    dispatch(modifyDayplan(res))
  }

  const handleRemoveDayplan = (res) => {
    dispatch(removeDayplan(res))
  }

  const handleAddCard = (res) => {
    dispatch(addCard(res))
  }

  const handleModifyCard = (res) => {
    dispatch(modifyCard(res))
  }

  const handleRemoveCard = (res) => {
    dispatch(removeCard(res))
  }

  //init and listen to changes
  useEffect(() => {
    // initial itinerary with latest version
    getFsData_Itinerary(projectId).then((itinerary) => {
      //initial and listen to dayplans
      listenToDayplans(
        itinerary.id,
        handleAddDayplan,
        handleModifyDayplan,
        handleRemoveDayplan
      )
      dispatch(initItinerary(itinerary))
    })

    listenToCard(projectId, handleAddCard, handleModifyCard, handleRemoveCard)
  }, [])

  // useEffect(() => {
  //   // initial itinerary with latest version
  //   getFsData_Itinerary(projectId).then((itinerary) => {
  //     //initial dayplans
  //     getFsData("dayplans", "itinerary_id", "==", itinerary.id).then(
  //       (dayplan) => {
  //         dispatch(initItinerary(itinerary))
  //         dispatch(initDayplans(dayplan))
  //       }
  //     )
  //   })

  //initial cards
  //   getFsData_Cards(projectId).then((res) => {
  //     dispatch(initCards(res))
  //   })
  //   console.log("init dayplans and cards")
  // }, [projectId])

  return (
    <Switch>
      <Route exact path={match.path}>
        <Navbar type="project" />
        <div className={styles.container}>
          <ul>
            <Link to={`${match.url}/todoList`}>待辦事項</Link>

            <Link to={`${match.url}/cards`}>卡片板</Link>

            <Link to={`${match.url}/itineraries/${itineraryId}`}>行程板</Link>

            <Link to={`${match.url}/expenditure`}>花費板</Link>
          </ul>
        </div>
      </Route>
      <Route path={`${match.path}/itineraries/:itineraryId`}>
        <Navbar type="itineraries" />
        <ItineraryBoard />
      </Route>
      <Route path={`${match.path}/cards`}>
        <Navbar type="cards" />
        <CardBoard />
      </Route>
      <Route path={`${match.path}/expenditure`}>
        <Navbar type="expenditure" />
        <Expenditure />
      </Route>
      <Route path={`${match.path}/todoList`}>
        <Navbar type="todoList" />
        <TodoList />
      </Route>
    </Switch>
  )
}

export default Project
