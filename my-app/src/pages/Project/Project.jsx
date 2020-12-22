import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import styles from "./project.module.scss"

import { ReactComponent as CardsIcon } from "../../img/icon/cards.svg"
import { ReactComponent as CalendarIcon } from "../../img/icon/calendar.svg"
import Navbar from "../Navbar/Navbar"
import ItineraryBoard from "./feature/itineraryBoard/ItineraryBoard"
import CardBoard from "./feature/CardBoard/CardBoard"
import Expenditure from "./feature/Expenditure/Expenditure"
import TodoList from "./feature/TodoList/TodoList"

import {
  getFsData_Itinerary,
  listenToDayplans,
  listenToCard,
  listenToMembers,
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
  modifyCardWithCheck,
  clearCardsState,
} from "./feature/CardBoard/cardSlice"

import {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} from "../User/membersSlice"

const Project = () => {
  // console.log("rerender Project component")

  let { projectId } = useParams()
  let match = useRouteMatch()
  const user = useSelector((state) => state.user)
  let itineraryId = useSelector((state) => state.itinerary.id)
  const cards = useSelector((state) => state.cards)
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

  const handleAddCard = (res, source) => {
    dispatch(addCard(res))
  }

  const handleModifyCard = (res, source) => {
    dispatch(modifyCard(res))
  }

  const checkModifyCard = (res) => {
    dispatch(modifyCardWithCheck(res))
  }

  const handleRemoveCard = (res, source) => {
    dispatch(removeCard(res))
  }

  const handleAddMember = (res, source) => {
    let input = {
      id: res.id,
      name: res.name,
      picture: res.picture,
    }
    dispatch(addMember(input))
  }

  const handleModifyMember = (res, source) => {
    let input = {
      id: res.id,
      name: res.name,
      picture: res.picture,
    }
    dispatch(modifyMember(input))
  }

  const handleRemoveMember = (res, source) => {
    let input = {
      id: res.id,
      name: res.name,
      picture: res.picture,
    }
    dispatch(removeMember(input))
  }

  //init and listen to changes
  useEffect(() => {
    // initial itinerary with latest version
    // getFsData_Itinerary(projectId).then((itinerary) => {
    //   //initial and listen to dayplans
    //   // let unsubscribeToDayplan = listenToDayplans(
    //   //   itinerary.id,
    //   //   handleAddDayplan,
    //   //   handleModifyDayplan,
    //   //   handleRemoveDayplan
    //   // )
    //   dispatch(initItinerary(itinerary))
    // })

    let unsubscribeToCard = listenToCard(
      projectId,
      handleAddCard,
      checkModifyCard,
      // handleModifyCard,
      handleRemoveCard
    )

    let unsubscribeToMembers = listenToMembers(
      projectId,
      handleAddMember,
      handleModifyMember,
      handleRemoveMember
    )

    return () => {
      unsubscribeToCard()
      unsubscribeToMembers()

      //reset cards and memebers' state
      dispatch(clearCardsState())
      dispatch(clearMembersState())
    }
  }, [])

  //check if user is in the project or not
  const history = useHistory()
  useEffect(() => {
    if (user.id && !user.projects.includes(projectId)) {
      alert("您沒有訪問這個旅行計劃的權限")
      history.replace({ pathname: "/projects" })
    }
  }, [user])

  return (
    <Switch>
      <Route path={`${match.path}/itineraries`}>
        <Navbar type="itineraries" />
        <ItineraryBoard />
      </Route>
      <Route path={`${match.path}/cards`}>
        <Navbar type="cards" />
        <CardBoard />
      </Route>
    </Switch>
  )
}

export default Project

//
//<Route exact path={match.path}>
//<Navbar type="project" />
//<div className={styles.container}>
//  <ul>
//    {/* <Link to={`${match.url}/todoList`}>待辦事項</Link> */}
//      <CardsIcon className={styles.cardsIcon} />
//      <div className={styles.title}>卡片板 </div>
//    </Link>
//
//    {/* <Link to={`${match.url}/itineraries/${itineraryId}`}> */}
//    <Link to={`${match.url}/itineraries/`}>
//      <CalendarIcon className={styles.itineraryIcon} />
//      <div className={styles.title}> 行程板 </div>
//    </Link>
//
//    {/* <Link to={`${match.url}/expenditure`}>花費板</Link> */}
//  </ul>
//</div>
//</Route>

//<Route path={`${match.path}/expenditure`}>
//        <Navbar type="expenditure" />
//        <Expenditure />
//      </Route>
//      <Route path={`${match.path}/todoList`}>
//        <Navbar type="todoList" />
//        <TodoList />
//      </Route>
