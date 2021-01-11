import React, { memo, useState, useEffect } from "react"
import { useParams, Route, Switch } from "react-router-dom"
import styles from "./CardBoard.module.scss"
import { AddCard_Fs } from "../../firebase/Config"
import { useWindowSize } from "../../utils/customHooks"
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

  const windowSize = useWindowSize()
  const padding = (windowSize?.width % 240) / 2

  return (
    <div
      id="cardBoardContainer"
      className={styles.container}
      style={{ padding: `0px ${padding}px` }}
      onClick={handleAddCard}
    >
      <FilteredCards />

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

const MemorizeCardBoard = memo(CardBoard)
export default MemorizeCardBoard
