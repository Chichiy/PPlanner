import React, { useState, useEffect, useRef } from "react"

import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"
import DayJS from "react-dayjs"

import { listenToLinks, listenToComments } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

const LinkIcon = ({ cardId }) => {
  const linksNumber = useRef(0)

  useEffect(() => {
    const handleAdd = () => {
      linksNumber.current += 1
    }
    const handleModify = () => {
      //do nothing
    }
    const handleRemove = () => {
      linksNumber.current -= 1
    }

    //listen to links number and handle counts
    const unsubscribe = listenToLinks(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )
    return unsubscribe
  }, [])

  return linksNumber.current > 0 ? (
    <div className={styles.small_card_icon__link}>{linksNumber.current}</div>
  ) : null
}

export default LinkIcon
