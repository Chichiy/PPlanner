import React, { useState } from "react"
import { useSelector } from "react-redux"
import styles from "./LargeCard.module.scss"
import { addComment_Fs } from "../../firebase/lib"
import { getColor } from "../../utils/lib"

const AddComment = ({ cardId, userId }) => {
  const userName = useSelector((state) => state.user.name)
  const [pending, setPending] = useState("")

  const addComment = (e) => {
    if (e.key === "Enter" && pending !== "") {
      let input = {
        card_id: cardId,
        sender_id: userId,
        content: pending,
        date: new Date(),
      }
      //update cloud data
      addComment_Fs(input)
      setPending("")
    }
  }

  return (
    <div className={styles.comment}>
      <div
        className={styles.user}
        style={{
          marginTop: "7px",
          backgroundColor: getColor(userId),
        }}
      >
        {userName[0]}
      </div>
      <div className={styles.details}>
        <input
          className={styles.add_message}
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          placeholder="撰寫留言"
          onKeyPress={addComment}
        />
      </div>
    </div>
  )
}

export default AddComment
