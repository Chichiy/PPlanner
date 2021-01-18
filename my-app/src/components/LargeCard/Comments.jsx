import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { ListenToCardsRelatedData } from "../../firebase/lib"
import AddComment from "./AddComment"
import Comment from "./Comment"

const Comments = () => {
  const { cardId } = useParams()
  const userId = useSelector((state) => state.user.id)
  const [comments, setComments] = useState([])

  useEffect(() => {
    const unsubscribe = ListenToCardsRelatedData(
      "comments",
      cardId,
      handleChange
    )
    return unsubscribe
  }, [])

  const handleChange = (type, res) => {
    switch (type) {
      case "added": {
        //prevent repeatedly addition when initializing
        if (comments.findIndex((comment) => comment.id === res.id) < 0) {
          setComments((prev) => [...prev, res])
        }
        break
      }
      case "removed": {
        setComments((prev) => prev.filter((comment) => comment.id !== res.id))
        break
      }
      default: {
        setComments((prev) =>
          prev.map((comment) => {
            return comment.id === res.id ? res : comment
          })
        )
      }
    }
  }

  return (
    <div className={styles.comments_section}>
      <div className={styles.control_bar}>
        <div className={styles.title}>留言</div>
      </div>
      <div className={styles.container}>
        <AddComment cardId={cardId} userId={userId} />
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} userId={userId} />
        })}
      </div>
    </div>
  )
}

export default Comments
