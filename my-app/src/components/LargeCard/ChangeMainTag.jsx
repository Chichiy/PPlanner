import React from "react"
import { useParams } from "react-router-dom"

import styles from "./LargeCard.module.scss"

import { updateCard_Fs } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

import { colorCode, categoryTitle, categories } from "../../utils/lib"

const ChangeMainTag = ({ card, isfloating, setFloat }) => {
  const { projectId, cardId } = useParams()

  const handleChangeMainTag = (e) => {
    let change = {
      category: e.target.dataset.category,
    }

    updateCard_Fs(projectId, cardId, change)
  }

  return (
    <div
      style={{
        top: `${isfloating.position.y + 32}px`,
        left: `${isfloating.position.x}px`,
      }}
      className={styles.addTag_container}
      aria-label="changeMainTag"
    >
      <span aria-label="changeMainTag" className={styles.addTag_span}>
        主標籤
      </span>

      {categories.map((category) => {
        return (
          <div key={nanoid()} className={styles.tag_container}>
            <div
              aria-label="changeMainTag"
              data-category={category}
              className={
                ` ${styles.tag}` +
                `  ${card.category === category && styles.active}`
              }
              style={{ backgroundColor: colorCode[category] }}
              onClick={handleChangeMainTag}
            >
              {categoryTitle(category)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChangeMainTag
