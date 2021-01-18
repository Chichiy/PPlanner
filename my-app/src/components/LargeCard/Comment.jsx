import React, { useState } from "react"
import { useSelector } from "react-redux"
import styles from "./LargeCard.module.scss"
import { updateComment_Fs, removeComment_Fs } from "../../firebase/lib"
import { getDiffTime, getColor } from "../../utils/lib"

const Comment = ({ comment, userId }) => {
  const isMyComment = userId === comment.sender_id

  //edit comment
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(comment.content)
  const handleEditComment = (e) => {
    if ((e.target.ariaLabel = "editBtn")) {
      if (isEditing) {
        updateComment(pending)
        setEditing(!isEditing)
      } else {
        setEditing(!isEditing)
      }
    }
  }

  const updateComment = (input) => {
    let change = {
      content: input,
    }
    updateComment_Fs(comment.id, change)
  }

  const removeComment = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這則留言嗎？")

      if (yes) {
        removeComment_Fs(comment.id)
      }
    }
  }

  const sender = useSelector((state) =>
    state.members.find((member) => member.id === comment.sender_id)
  )

  try {
    return (
      <div className={styles.comment}>
        <div
          className={styles.user}
          style={{ backgroundColor: getColor(sender.id) }}
        >
          {sender.name[0]}
        </div>
        <div className={styles.details}>
          <div className={styles.info}>
            <div className={styles.name}>{sender.name}</div>
            <div className={styles.time}>{getDiffTime(comment.date)}</div>
          </div>

          {isEditing ? (
            <textarea
              className={styles.message}
              value={pending}
              onChange={(e) => setPending(e.target.value)}
              autoFocus
            />
          ) : (
            <pre className={styles.message}>{comment.content} </pre>
          )}

          {isMyComment ? (
            <div className={styles.tools}>
              <div
                aria-label="editBtn"
                className={styles.edit_button}
                onClick={handleEditComment}
              >
                編輯
              </div>
              <div
                aria-label="removeBtn"
                className={styles.edit_button}
                onClick={removeComment}
              >
                刪除
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  } catch {
    return null
  }
}

export default Comment
