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
import { listenToCards, listenToMembers } from "../../firebase/lib"
import {
  initCards,
  addCard,
  modifyCardWithCheck,
  removeCard,
  clearCardsState,
} from "../../redux/slices/cardSlice"
import {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} from "../../redux/slices/membersSlice"

const Project = () => {
  const [access, setAccess] = useState(false)

  let { projectId } = useParams()
  let match = useRouteMatch()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleUpdateMembers = (res) => {
    res.forEach((member) => {
      const input = {
        id: member.id,
        name: member.name,
        picture: member.picture,
      }
      if (member.type === "added") {
        dispatch(addMember(input))
      }
      if (member.type === "modified") {
        dispatch(modifyMember(input))
      }
      if (member.type === "removed") {
        dispatch(removeMember(input))
      }
    })
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
    const unsubscribeToCard =
      access && listenToCards(projectId, handleUpdateCard)

    const unsubscribeToMembers =
      access && listenToMembers(projectId, handleUpdateMembers)

    return () => {
      if (access) {
        unsubscribeToCard()
        unsubscribeToMembers()

        //reset cards and members' state
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
