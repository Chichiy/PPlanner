import React, { useState } from "react"

import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"

import { nanoid } from "@reduxjs/toolkit"

const PendingTitle = (props) => {
  const [isEditing, setEditing] = useState(true)
  const [pending, setPending] = useState("")

  let { pendingTitle, handleTitleUpdate } = props

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
