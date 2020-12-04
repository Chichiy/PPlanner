import React, { useState, useEffect } from "react"

import styles from "./cardBoard.module.scss"

import SmallCard from "./component/SmallCard"
import LargeCard from "./component/LargeCard"

const CardBoard = () => {
  return (
    <div className={styles.container}>
      <SmallCard />

      <LargeCard />
    </div>
  )
}

export default CardBoard
