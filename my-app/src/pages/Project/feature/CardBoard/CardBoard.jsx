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

import styles from "./cardBoard.module.scss"

import SmallCard from "./component/SmallCard"
import LargeCard from "./component/LargeCard"
import { useSelector } from "react-redux"

const CardBoard = () => {
  const [showLargeCard, toggleShowCard] = useState(false)
  let location = useLocation()
  let cards = useSelector((state) => state.cards)

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

  return (
    <div className={styles.container}>
      {filteredCard().map((card) => {
        return <SmallCard key={card.id} card={card} />
      })}

      {showLargeCard ? <LargeCard /> : null}
    </div>
  )
}

export default CardBoard
