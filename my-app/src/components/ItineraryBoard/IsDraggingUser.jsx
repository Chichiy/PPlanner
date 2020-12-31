import React from "react"
import { useSelector } from "react-redux"
import styles from "./ItineraryBoard.module.scss"
import { getColor } from "../../utils/lib"

const IsDraggingUser = ({ isDragging }) => {
  const members = useSelector((state) => state.members)
  const isDraggingUser = members.find((member) => member.id === isDragging)
  if (isDragging) {
    return (
      <div
        className={styles.isDragging_user}
        style={{
          backgroundColor: getColor(isDragging),
        }}
      >
        {isDraggingUser.name[0]}
      </div>
    )
  } else {
    return null
  }
}

export default IsDraggingUser
