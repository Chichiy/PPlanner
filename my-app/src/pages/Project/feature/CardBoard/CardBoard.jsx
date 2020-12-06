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

const CardBoard = () => {
  console.log("re-cardBoard")
  const [showLargeCard, toggleShowCard] = useState(false)
  const [addCard, toggleAddCard] = useState(false)
  let location = useLocation()
  let cards = useSelector((state) => state.cards)
  let { projectId } = useParams()

  //get searched tags from URL
  const useQuery = () => {
    let tagString = new URLSearchParams(useLocation().search).get("tag")
    return tagString ? tagString.split(" ") : null
  }
  let searchTags = useQuery()

  //filter cards
  const filteredCard = () => {
    return searchTags
      ? cards.filter((card) => {
          for (let i = 0; i < searchTags.length; i++) {
            if (card.tags.includes(searchTags[i])) {
              return true
            }
          }
        })
      : cards
  }

  //show add card

  const getPendingInfo = (pendingInfo) => {
    return pendingInfo
  }

  //new card data
  const emptyCard = {
    title: "",
    description: "",
    category: "default",
    tags: ["default"],
    status: 0,
    cover_pic: "https://fakeimg.pl/65x65/",
  }

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
          console.log("save")
          console.log(pendingInfo)
          AddCard_Fs(projectId, pendingInfo)
          setPendingInfo(emptyCard)
          toggleAddCard(!addCard)
          break
        }

        default: {
          toggleAddCard(!addCard)
          break
        }
      }
    }
  }
  //show large cards
  const handleShowCard = (e) => {
    let triggerElementId = ["closeBtn", "largeCardBackground"]
    if (triggerElementId.includes(e.target.id)) {
      toggleShowCard(!showLargeCard)
    }
  }

  return (
    <div
      id="cardBoardContainer"
      className={styles.container}
      onClick={handleAddCard}
    >
      {filteredCard().map((card) => {
        return <SmallCard key={card.id} card={card} />
      })}
      {addCard ? (
        <AddCard pendingInfo={pendingInfo} setPendingInfo={setPendingInfo} />
      ) : null}
      {showLargeCard ? <LargeCard toggleShowCard={toggleShowCard} /> : null}
    </div>
  )
}

export default CardBoard
