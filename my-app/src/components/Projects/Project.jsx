import React, { useEffect } from "react"
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

import { listenToCard, listenToMembers } from "../../firebase/Config"

import {
  addCard,
  modifyCard,
  removeCard,
  modifyCardWithCheck,
  clearCardsState,
} from "../../redux/slices/cardSlice"

import {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} from "../../redux/slices/membersSlice"

const Project = () => {
  // console.log("rerender Project component")

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

  //init and listen to changes
  useEffect(() => {
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
