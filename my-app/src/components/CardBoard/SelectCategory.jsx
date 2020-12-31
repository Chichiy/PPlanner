import React from "react"
import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"
import { nanoid } from "@reduxjs/toolkit"

const SelectCategory = ({ selected, handleSelectCategory }) => {
  const categories = ["hotel", "activity", "site", "food", "commute", "default"]

  return (
    <div className={styles.selectCategory}>
      {categories.map((category) => {
        return (
          <option
            key={nanoid()}
            value={category}
            style={{
              backgroundColor: colorCode[category],
            }}
            className={
              selected === category
                ? `${styles.option} ${styles.current}`
                : styles.option
            }
            onClick={handleSelectCategory}
          >
            {categoryTitle(category)}
          </option>
        )
      })}
    </div>
  )
}

export default SelectCategory
