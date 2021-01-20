import React, { useState } from "react"
import styles from "./CardBoard.module.scss"

const PendingTitle = ({ pendingTitle, handleTitleUpdate, addCardRef }) => {
  const [isEditing, setEditing] = useState(true)
  const [pending, setPending] = useState("")

  const toggleInputTitle = (e) => {
    if (e.target.id === "pendingTitle") {
      setEditing(!isEditing)
    }
  }

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleTitleUpdate(e.target.value)
      } else {
        handleTitleUpdate("")
      }
    }
  }

  if (isEditing) {
    return (
      <input
        ref={addCardRef}
        type="text"
        className={styles.inputTitle}
        placeholder="請輸入標題"
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
        autoFocus
      />
    )
  } else {
    return (
      <div
        id="pendingTitle"
        className={styles.title}
        onClick={toggleInputTitle}
      >
        {pendingTitle}
      </div>
    )
  }
}

export default PendingTitle
