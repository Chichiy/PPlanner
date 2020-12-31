import React, { useState, useEffect, useRef } from "react"

import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"
import DayJS from "react-dayjs"

import { listenToLinks, listenToComments } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"
import CommentIcon from "./CommentIcon"
import LinkIcon from "./LinkIcon"

const SmallCard = ({ card, project }) => {
  return (
    <div id={card.id} className={styles.card_small}>
      <div
        className={styles.tag}
        style={{ backgroundColor: colorCode[card.category] }}
      ></div>
      <div className={styles.info}>
        {/* <div className={styles.card_small_picture}>
          <img src={card.cover_pic} alt="pic" />
        </div> */}
        <div className={styles.details}>
          <div className={styles.title}>{card.title}</div>
          <div className={styles.description}>{card.description}</div>
        </div>
        <div className={styles.small_card_icons}>
          {/* show card's status  */}
          {card.start_time && (
            <div className={styles.small_card_icon__status}>
              <DayJS format="MM/DD">{card.start_time}</DayJS>
            </div>
          )}

          {/* show card's link number  */}

          <LinkIcon cardId={card.id} />

          {/* show card's comment number  */}
          <CommentIcon cardId={card.id} />

          {/* fill empty  */}
          <div className={styles.space}></div>

          {/* show card's tags  */}
          {card.tags.length > 0 &&
            card.tags.map((tag) => {
              try {
                let target = project.tags.find((item) => item.id === tag)
                return (
                  <div
                    key={nanoid()}
                    style={{ backgroundColor: colorCode[target.color] }}
                    className={styles.small_card_icon__tag}
                  ></div>
                )
              } catch {
                return null
              }
            })}
        </div>
      </div>
    </div>
  )
}

export default SmallCard
