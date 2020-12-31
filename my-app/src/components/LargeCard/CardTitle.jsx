import React, { useState } from "react"

import styles from "./LargeCard.module.scss"

const CardTitle = ({ title, handleUpdateTitle }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(title)

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleUpdateTitle(e.target.value)
      } else {
        alert("請輸入卡片標題")
      }
    }
  }

  return (
    <input
      type="text"
      className={styles.card_title_edit}
      value={pending}
      onChange={(e) => setPending(e.target.value)}
      onBlur={handleTitleEdit}
      onKeyPress={handleTitleEdit}
    />
  )
}

export default CardTitle
