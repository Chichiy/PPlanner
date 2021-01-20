import React, { useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { FS } from "../../firebase/lib"

const CardTitle = ({ title }) => {
  const { projectId, cardId } = useParams()
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(title)

  const handleEdit = (e) => {
    if (e.key === "Enter") {
      e.target.blur()
    }
    if (e.type === "blur") {
      FS.cards.update(projectId, cardId, {
        title: e.target.value,
      })
      setEditing(!isEditing)
    }
  }

  return (
    <input
      type="text"
      className={styles.card_title_edit}
      value={pending}
      onChange={(e) => setPending(e.target.value)}
      onBlur={handleEdit}
      onKeyPress={handleEdit}
    />
  )
}

export default React.memo(CardTitle)
