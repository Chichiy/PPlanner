import React, { useState } from "react"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import styles from "./CardBoard.module.scss"
import SmallCard from "./SmallCard"
import LargeCard from "../LargeCard/LargeCard"
import { AddCard_Fs } from "../../firebase/Config"
import AddCard from "./AddCard"

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
    // cover_pic: "https://fakeimg.pl/65x65/",
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

  return (
    <div
      id="cardBoardContainer"
      className={styles.container}
      onClick={handleAddCard}
    >
      {filteredCard().map((card) => {
        return (
          <Link to={`${match.url}/${card.id}`} key={card.id}>
            <SmallCard card={card} project={project} />
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
      <div className={styles.addCardButton} onClick={() => toggleAddCard(true)}>
        <div className={styles.tooltip_text}>新增卡片</div>
      </div>
    </div>
  )
}

export default CardBoard
