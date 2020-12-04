import React, { useState, useEffect } from "react"

import styles from "../cardBoard.module.scss"

const SmallCard = () => {
  return (
    <div className={styles.card_small}>
      <div className={styles.mainTag}></div>
      <div className={styles.info}>
        <div className={styles.card_small_picture}>
          <img
            src="https://mk0newsmarketlxfg8j2.kinstacdn.com/shop/files/2019/01/%E7%B3%99%E7%B1%B3%E7%A9%80%E7%B2%8905.jpg"
            alt="pic"
          />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>烈日鬆餅</div>
          <div className={styles.keywords}>超想吃</div>
        </div>
      </div>
    </div>
  )
}
export default SmallCard
