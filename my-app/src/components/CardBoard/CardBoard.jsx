import React, { useState, useRef, useEffect } from "react"
import {
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
} from "react-router-dom"
import { useSelector } from "react-redux"
import styles from "./CardBoard.module.scss"
import SmallCard from "./SmallCard"
import LargeCard from "../LargeCard/LargeCard"
import { AddCard_Fs } from "../../firebase/Config"
import AddCard from "./AddCard"
import { nanoid } from "@reduxjs/toolkit"

const CardBoard = () => {
  const cards = useSelector((state) => state.cards)

  const { projectId } = useParams()
  const project = useSelector((state) =>
    state.projects.find((project) => project.id === projectId)
  )
  const match = useRouteMatch()

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
          return false
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
    isDragging: false,
  }

  const [addCard, toggleAddCard] = useState(false)
  const [pendingInfo, setPendingInfo] = useState(emptyCard)

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
          toggleAddCard(!addCard)
          break
        }
      }
    }
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const padding = (windowWidth % 240) / 2

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth))
  }, [])

  return (
    <div
      id="cardBoardContainer"
      // ref={cardBoardContainer}
      className={styles.container}
      style={{ padding: `0px ${padding}px` }}
      onClick={handleAddCard}
    >
      {filteredCard().map((card) => {
        return <SmallCard key={card.id} card={card} />
      })}
      {addCard ? (
        <AddCard pendingInfo={pendingInfo} setPendingInfo={setPendingInfo} />
      ) : null}
      <Switch>
        <Route path={`/projects/:projectId/:boardType/:cardId`}>
          <LargeCard />
        </Route>
      </Switch>
      <div className={styles.addCardButton} onClick={() => toggleAddCard(true)}>
        <div className={styles.tooltip_text}>新增卡片</div>
      </div>
    </div>
  )
}

const areEqual = (prevProps, nextProps) => {
  return true
}

const MemorizeCardBoard = React.memo(CardBoard, areEqual)
export default MemorizeCardBoard
