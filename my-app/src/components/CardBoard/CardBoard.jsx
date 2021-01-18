import React, { memo, useState, useRef, useEffect } from "react"
import { useParams, Route, Switch } from "react-router-dom"
import styles from "./CardBoard.module.scss"
import { AddCard_Fs } from "../../firebase/lib"
import { useWindowSize, useKeyDown } from "../../utils/customHooks"
import FilteredCards from "./FilteredCards"
import AddCard from "./AddCard"
import LargeCard from "../LargeCard/LargeCard"

const CardBoard = () => {
  const { projectId } = useParams()

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
    const shouldAddCard = pendingInfo.title || pendingInfo.description
    if (shouldAddCard) {
      if (e.target?.id === "cardBoardContainer") {
        AddCard_Fs(projectId, pendingInfo)
        toggleAddCard(!addCard)
        setPendingInfo(emptyCard)
      }
    } else {
      if (e.target?.id === "cardBoardContainer") {
        toggleAddCard(!addCard)
      }
    }
  }

  const windowSize = useWindowSize()
  const padding = (windowSize?.width % 240) / 2
  const addCardRef = useRef(null)

  const handleClickAddCard = () => {
    toggleAddCard(true)

    addCardRef.current?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => {
      addCardRef.current?.focus()
    }, 500)
  }

  return (
    <div
      id="cardBoardContainer"
      className={styles.container}
      style={{ padding: `20px ${padding}px` }}
      onClick={handleAddCard}
    >
      <FilteredCards />

      {addCard && (
        <AddCard
          addCardRef={addCardRef}
          pendingInfo={pendingInfo}
          setPendingInfo={setPendingInfo}
        />
      )}

      <Switch>
        <Route path={`/projects/:projectId/:boardType/:cardId`}>
          <LargeCard />
        </Route>
      </Switch>

      <div className={styles.addCardButton} onClick={handleClickAddCard}>
        <div className={styles.tooltip_text}>新增卡片</div>
      </div>
    </div>
  )
}

const MemorizeCardBoard = memo(CardBoard)
export default MemorizeCardBoard
