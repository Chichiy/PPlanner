import React, { useEffect, useState, useRef } from "react"
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import Navbar from "../Navbar/Navbar"
import ItineraryBoard from "../ItineraryBoard/ItineraryBoard"
import CardBoard from "../CardBoard/CardBoard"

import {
  listenToCard,
  listenToCard2,
  listenToMembers,
} from "../../firebase/lib"

import {
  addCard,
  modifyCard,
  removeCard,
  modifyCardWithCheck,
  clearCardsState,
  initCards,
} from "../../redux/slices/cardSlice"

import {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} from "../../redux/slices/membersSlice"

const Project = () => {
  // console.log("rerender Project component")

  const [access, setAccess] = useState(false)

  let { projectId } = useParams()
  let match = useRouteMatch()
  const user = useSelector((state) => state.user)
  let itineraryId = useSelector((state) => state.itinerary.id)
  const cards = useSelector((state) => state.cards)
  const dispatch = useDispatch()

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

  const isInit = useRef(true)
  const handleUpdateCard = (res) => {
    if (isInit.current) {
      dispatch(initCards(res))
      isInit.current = false
    } else {
      res.forEach((card) => {
        if (card.type === "added") {
          delete card.type
          dispatch(addCard(card))
        }
        if (card.type === "modified") {
          delete card.type
          dispatch(modifyCardWithCheck(card))
        }
        if (card.type === "removed") {
          delete card.type
          dispatch(removeCard(card))
        }
      })
    }
  }

  //init and listen to changes
  useEffect(() => {
    // const unsubscribeToCard =
    //   access &&
    //   listenToCard(projectId, handleAddCard, checkModifyCard, handleRemoveCard)

    const unsubscribeToCard =
      access && listenToCard2(projectId, handleUpdateCard)

    const unsubscribeToMembers =
      access &&
      listenToMembers(
        projectId,
        handleAddMember,
        handleModifyMember,
        handleRemoveMember
      )

    return () => {
      if (access) {
        unsubscribeToCard()
        unsubscribeToMembers()

        //reset cards and memebers' state
        dispatch(clearCardsState())
        dispatch(clearMembersState())
      }
    }
  }, [access])

  //check if user is in the project or not
  const history = useHistory()

  useEffect(() => {
    if (user.id && user.projects.includes(projectId)) {
      setAccess(true)
    }

    if (user.id && !user.projects.includes(projectId)) {
      alert("您沒有訪問這個旅行計劃的權限")
      history.replace("/projects")
    }
  }, [user])

  return (
    <Switch>
      <Route path={`${match.path}/itineraries`}>
        <Navbar />
        <ItineraryBoard />
      </Route>
      <Route path={`${match.path}/cards`}>
        <Navbar />
        <CardBoard />
      </Route>
    </Switch>
  )
}

export default Project
