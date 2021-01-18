import { useEffect, useState, memo } from "react"
import styles from "./CardBoard.module.scss"
import { ListenToCardsRelatedData } from "../../firebase/lib"

const DataNumber = ({ cardId, dataType }) => {
  const [counts, setCounts] = useState(0)
  const countDataNumber = (type) => {
    if (type === "added") {
      setCounts((counts) => counts + 1)
    }
    if (type === "removed") {
      setCounts((counts) => counts - 1)
    }
  }

  useEffect(() => {
    const unsubscribe = ListenToCardsRelatedData(
      dataType,
      cardId,
      countDataNumber
    )
    return unsubscribe
  }, [dataType, cardId])

  return counts > 0 ? (
    <div className={styles[`small_card_icon__${dataType}`]}>{counts}</div>
  ) : null
}

const MemorizeDataNumber = memo(DataNumber)

export default MemorizeDataNumber
