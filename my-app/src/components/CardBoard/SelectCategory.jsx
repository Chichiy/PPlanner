import React from "react"
import styles from "./CardBoard.module.scss"
import { categories, colorCode, getCategoryTitle } from "../../utils/lib"

const SelectCategory = ({ selected, handleSelectCategory }) => {
  return (
    <div className={styles.selectCategory}>
      {categories.map((category, index) => {
        return (
          <option
            key={index}
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
            {getCategoryTitle(category)}
          </option>
        )
      })}
    </div>
  )
}

export default SelectCategory
