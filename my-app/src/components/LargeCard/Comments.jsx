import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./LargeCard.module.scss"
import { listenToComments } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"
import AddComment from "./AddComment"
import Comment from "./Comment"

//////Comments//////

const Comments = ({ cardId, projectId }) => {
  const userId = useSelector((state) => state.user.id)
  const [comments, setComments] = useState([])
  //get data from cloud
  useEffect(() => {
    let unsubscribe = listenToComments(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )

    return unsubscribe
  }, [])

  const handleAdd = (res, source) => {
    //prevent repeatly adding when itinitallizing
    if (comments.findIndex((comment) => comment.id === res.id) < 0) {
      setComments((prev) => [...prev, res])
    }
  }

  const handleModify = (res) => {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === res.id ? res : comment
      })
    )
  }

  const handleRemove = (res, source) => {
    setComments((prev) => prev.filter((comment) => comment.id !== res.id))
  }

  return (
    <div className={styles.comments_section}>
      <div className={styles.controll_bar}>
        <div className={styles.title}>留言</div>
      </div>
      <div className={styles.container}>
        {/* comment */}
        <AddComment cardId={cardId} userId={userId} />
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} userId={userId} />
        })}
      </div>
    </div>
  )
}

export default Comments
