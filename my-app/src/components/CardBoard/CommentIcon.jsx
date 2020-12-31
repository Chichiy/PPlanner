import React, { useState, useEffect, useRef } from "react"

import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"
import DayJS from "react-dayjs"

import { listenToLinks, listenToComments } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

const CommentIcon = ({ cardId }) => {
  const commentsNumber = useRef(0)

  useEffect(() => {
    const handleAdd = () => {
      commentsNumber.current += 1
    }

    const handleModify = () => {
      //do nothing
    }
    const handleRemove = () => {
      commentsNumber.current -= 1
    }

    //listen to links number and handle counts
    const unsubscribe = listenToComments(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )
    return unsubscribe
  }, [])

  return commentsNumber.current > 0 ? (
    <div className={styles.small_card_icon__comment}>
      {commentsNumber.current}
    </div>
  ) : null
}

export default CommentIcon
