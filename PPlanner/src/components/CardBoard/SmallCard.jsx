import React, { memo } from "react"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import styles from "./CardBoard.module.scss"
import SavedDate from "./SavedDate"
import SavedTags from "./SavedTags"
import DataNumber from "./DataNumber"
import { colorCode } from "../../utils/lib"

const SmallCard = ({ card }) => {
  const match = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const toggleLargeCard = () => {
    history.push({
      state: location.state,
      pathname: `${match.url}/${card.id}`,
    })
  }

  return (
    <div id={card.id} className={styles.card_small} onClick={toggleLargeCard}>
      <div
        className={styles.main_tag}
        style={{ backgroundColor: colorCode[card.category] }}
      ></div>
      <div className={styles.info}>
        <div className={styles.details}>
          <div className={styles.title}>{card.title}</div>
          <div className={styles.description}>{card.description}</div>
        </div>
        <div className={styles.small_card_icons}>
          <SavedDate date={card.start_time} />
          <DataNumber cardId={card.id} dataType="links" />
          <DataNumber cardId={card.id} dataType="comments" />
          <div className={styles.space} />
          <SavedTags tags={card.tags} />
        </div>
      </div>
    </div>
  )
}

const MemorizeSamllCard = memo(SmallCard)
export default MemorizeSamllCard
