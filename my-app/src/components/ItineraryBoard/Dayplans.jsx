import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useLocation } from "react-router-dom"
import styles from "./ItineraryBoard.module.scss"
import { modifyCardProperties } from "../../redux/slices/cardSlice"
import { updateCard_Fs } from "../../firebase/Config"
import Appointments from "./Appointments"
import TimeTable from "./TimeTable"

const Dayplans = () => {
  //set start time
  const cards = useSelector((state) => state.cards)
  const location = useLocation()
  let startDate
  try {
    //get startTime from navbar through state in loaction
    startDate = location.state.startDate
  } catch {
    //if no, show today
    let temp = new Date()
    temp.setHours(0)
    temp.setMinutes(0)
    temp.setSeconds(0)
    temp.setMilliseconds(0)
    startDate = temp
  }

  //expand edit feature
  const { projectId } = useParams()
  const [isExpanding, setExpanding] = useState(false)
  const dispatch = useDispatch()

  const handleExpandStart = (e) => {
    if (e.target.ariaLabel === "lower") {
      setExpanding(e.target.dataset.cardid)
    }
  }

  const handleExpandEnd = () => {
    //check if isExpanding
    if (isExpanding) {
      //get target size and position
      let targetCardId = isExpanding
      let target = document.querySelector(`[data-displayid="${targetCardId}"]`)
      let targetHeight = target.getBoundingClientRect().height

      //per 30 mins
      let timeSpan =
        targetHeight % 20 < 11
          ? Math.floor(targetHeight / 20)
          : Math.ceil(targetHeight / 20)

      //get original data
      let targetData = cards.find((card) => card.id === targetCardId)
      let startTime = new Date(targetData.start_time)
      let newEndTime = new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)

      //prepare changes
      let change = {
        end_time: newEndTime,
      }
      let convertedChange = {
        end_time: newEndTime.toString(),
      }

      //update locally first
      dispatch(
        modifyCardProperties({ change: convertedChange, id: targetCardId })
      )
      //update to cloud database
      updateCard_Fs(projectId, targetCardId, change)

      //turn off listening
      setExpanding(false)
    }
  }

  const handlePosition = (e) => {
    //listen to mousemove
    if (isExpanding) {
      //mouse position
      let mousePosition = e.clientY

      //get target size and position
      let targetId = isExpanding
      let target = document.querySelector(`[data-displayid="${targetId}"]`)
      let targetPosition = target.getBoundingClientRect()

      //new height (10px for buffer)
      let rawHeight = mousePosition - targetPosition.top + 10

      let timeSpan =
        rawHeight % 20 < 11
          ? Math.floor(rawHeight / 20)
          : Math.ceil(rawHeight / 20)
      let newHeight = timeSpan * 20

      //at least need to be longer than 20px (30mins)
      if (newHeight > 19) {
        target.style.height = `${newHeight}px`
      }

      //update end time display
      let endTimeElement = target.querySelector(
        `time[aria-label="expandEndTime"]`
      )
      let startTime = new Date(
        cards.find((card) => card.id === targetId).start_time
      )
      let newEndTime = new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)

      endTimeElement.textContent = `${
        newEndTime.getHours() < 10
          ? `0${newEndTime.getHours()}`
          : newEndTime.getHours()
      }:${newEndTime.getMinutes() < 30 ? `00` : "30"}`
    }
  }

  return (
    <div id="itineraryBoard" className={styles.itineraryBoard}>
      <TimeTable
        startDate={startDate}
        cards={cards}
        handleExpandEnd={handleExpandEnd}
        handlePosition={handlePosition}
      />
      <Appointments
        startDate={startDate}
        cards={cards}
        isExpanding={isExpanding}
        handleExpandStart={handleExpandStart}
        handleExpandEnd={handleExpandEnd}
        handlePosition={handlePosition}
      />
    </div>
  )
}

export default Dayplans
