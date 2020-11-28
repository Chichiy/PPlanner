import React, { useState, useEffect } from "react"

import styles from "../../../scss/cardBoard.module.scss"

const CardList = () => {
  return (
    <div id="cardList" className={styles.cardList}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>card1</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>card2</div>
      </div>
    </div>
  )
}

export default CardList
