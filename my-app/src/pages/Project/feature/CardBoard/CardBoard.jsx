import React, { useState, useEffect } from "react"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import styles from "./cardBoard.module.scss"

import { SmallCard, AddCard } from "./component/SmallCard"
import LargeCard from "./component/LargeCard"

import { AddCard_Fs } from "../../../../firebase/Config"
import { wait } from "@testing-library/react"

const CardBoard = () => {
  // console.log("re-cardBoard")

  const cards = useSelector((state) => state.cards)
  const { projectId } = useParams()
  const project = useSelector((state) =>
    state.projects.find((project) => project.id === projectId)
  )
  const match = useRouteMatch()

  //////filter cards//////

  //get searched tags from URL
  const useQuery = () => {
    let tagString = new URLSearchParams(useLocation().search).get("tag")
    return tagString ? tagString.split(" ") : null
  }
  let searchTags = useQuery()

  const findTagId = (tagName) => {
    try {
      return project.tags.find((tag) => tag.name === tagName).id
    } catch {
      return null
    }
  }

  const filteredCard = () => {
    return searchTags
      ? cards.filter((card) => {
          for (let i = 0; i < searchTags.length; i++) {
            if (card.tags.includes(findTagId(searchTags[i]))) {
              return true
            }
          }
        })
      : cards
  }

  //////add new card//////
  const emptyCard = {
    title: "",
    description: "",
    category: "default",
    tags: [],
    status: 0,
    cover_pic: "https://fakeimg.pl/65x65/",
  }

  const [addCard, toggleAddCard] = useState(false)
  const [pendingInfo, setPendingInfo] = useState(emptyCard)
  const dispatch = useDispatch()

  const handleAddCard = (e) => {
    let triggerElementId = ["cardBoardContainer"]
    if (triggerElementId.includes(e.target.id)) {
      let shouldAddCard = !(
        JSON.stringify(pendingInfo) === JSON.stringify(emptyCard)
      )

      switch (shouldAddCard) {
        case true: {
          AddCard_Fs(projectId, pendingInfo)

          toggleAddCard(!addCard)
          setPendingInfo(emptyCard)

          break
        }

        default: {
          // toggleAddCard(!addCard)
          toggleAddCard(!addCard)
          break
        }
      }
    }
  }

  return (
    <div
      id="cardBoardContainer"
      className={styles.container}
      onDoubleClick={handleAddCard}
    >
      {filteredCard().map((card) => {
        return (
          <Link to={`${match.url}/${card.id}`} key={card.id}>
            <SmallCard card={card} />
          </Link>
        )
      })}
      {addCard ? (
        <AddCard pendingInfo={pendingInfo} setPendingInfo={setPendingInfo} />
      ) : null}
      <Switch>
        <Route path={`${match.path}/:cardId`}>
          <LargeCard />
        </Route>
      </Switch>
    </div>
  )
}

export default CardBoard
