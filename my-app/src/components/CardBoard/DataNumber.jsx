import React, { useEffect, useState } from "react"
import styles from "./CardBoard.module.scss"
import { ListenToCardsRelatedData } from "../../firebase/lib"

const DataNumber = ({ cardId, dataType }) => {
  const [counts, setCounts] = useState(0)
  const CountDataNumber = (changeType) => {
    if (changeType === "added") {
      setCounts((counts) => counts + 1)
    }
    if (changeType === "removed") {
      setCounts((counts) => counts - 1)
    }
  }

  useEffect(() => {
    const unsubscribe = ListenToCardsRelatedData(
      dataType,
      cardId,
      CountDataNumber
    )
    return unsubscribe
  }, [dataType, cardId])

  return counts > 0 ? (
    <div className={styles[`small_card_icon__${dataType}`]}>{counts}</div>
  ) : null
}

const MemorizeDataNumber = React.memo(DataNumber)

export default MemorizeDataNumber
