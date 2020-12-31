import React, { useState } from "react"
import styles from "./CardBoard.module.scss"

const PendingDescription = (props) => {
  const [isEditing, setEditing] = useState(true)
  const [pending, setPending] = useState("")

  let { pendingDescription, handleDescriptionUpdate } = props

  const toggleInputDescription = (e) => {
    if (e.target.id === "pendingDescription") {
      setEditing(!isEditing)
    }
  }

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleDescriptionUpdate(e.target.value)
      } else {
        handleDescriptionUpdate("")
      }
    }
  }

  if (isEditing) {
    return (
      <textarea
        type="text"
        className={styles.inputDescription}
        placeholder="對卡片增加描述"
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
      />
    )
  } else {
    return (
      <div
        id="pendingDescription"
        className={styles.description}
        onClick={toggleInputDescription}
      >
        {pendingDescription}
      </div>
    )
  }
}

export default PendingDescription
