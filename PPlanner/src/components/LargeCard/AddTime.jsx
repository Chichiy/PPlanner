import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { FS } from "../../firebase/lib"
import { getPureDate, getFloatStyle } from "../../utils/lib"
import DaySelect from "./DaySelect"
import { useWindowSize } from "../../utils/customHooks"

const AddTime = ({ card, isFloating, setFloat }) => {
  const { projectId, cardId } = useParams()
  const windowSize = useWindowSize()

  //input time holder
  const [startDate, setStartDate] = useState(getPureDate(new Date()))
  const [endDate, setEndDate] = useState(getPureDate(new Date()))

  useEffect(() => {
    //update time to the latest value
    try {
      if (card.start_time && card.end_time) {
        setStartDate(new Date(card.start_time))
        setEndDate(new Date(card.end_time))
      }
    } catch {}
  }, [])

  const handleAddTime = () => {
    if (
      //check is input valid
      endDate - startDate < 0 ||
      endDate - startDate > 24 * 60 * 60 * 1000 ||
      endDate.getDate() !== startDate.getDate()
    ) {
      alert("日期格式有誤，目前僅接受在同一天開始與結束的時間")
    } else {
      //update to cloud database
      let change = {
        status: 1,
        start_time: startDate,
        end_time: endDate,
      }
      FS.cards.update(projectId, cardId, change)
      setFloat(false)
    }
  }

  return (
    <div
      aria-label="addTime"
      className={styles.addTime_container}
      style={getFloatStyle(isFloating, windowSize)}
    >
      <div aria-label="addTime" className={styles.addLink_span}>
        開始時間
      </div>
      <DaySelect date={startDate} setDate={setStartDate} />
      <div aria-label="addTime" className={styles.addLink_span}>
        結束時間
      </div>
      <DaySelect date={endDate} setDate={setEndDate} />
      <div
        aria-label="addTime"
        className={styles.addLink_button}
        onClick={handleAddTime}
      >
        儲存
      </div>
    </div>
  )
}

export default AddTime
