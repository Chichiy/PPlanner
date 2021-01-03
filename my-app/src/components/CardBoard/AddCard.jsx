import React, { useState } from "react"
import styles from "./CardBoard.module.scss"
import { colorCode } from "../../utils/lib"
import SelectCategory from "./SelectCategory"
import PendingTitle from "./PendingTitle"
import PendingDescription from "./PendingDescription"

export const AddCard = ({ pendingInfo, setPendingInfo, shouldAddCard }) => {
  const [selectCategory, setCategory] = useState(false)
  const toggleCategorySelect = (e) => {
    if (e.target.id === "pendingCategory") {
      setCategory(!selectCategory)
    }
  }
  const updateCategory = (e) => {
    setPendingInfo({
      ...pendingInfo,
      category: e.target.value,
    })
    setCategory(!selectCategory)
  }

  const updateTitle = (input) => {
    setPendingInfo({ ...pendingInfo, title: input })
  }

  const updateDescription = (input) => {
    setPendingInfo({ ...pendingInfo, description: input })
  }

  return (
    <div className={styles.card_small}>
      <div
        id="pendingCategory"
        className={styles.add_main_tag}
        style={{ backgroundColor: colorCode[pendingInfo.category] }}
        onClick={toggleCategorySelect}
      >
        {selectCategory ? (
          <SelectCategory
            handleSelectCategory={updateCategory}
            selected={pendingInfo.category}
          />
        ) : null}
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <PendingTitle
            pendingTitle={pendingInfo.title}
            handleTitleUpdate={updateTitle}
          />

          <PendingDescription
            pendingDescription={pendingInfo.description}
            handleDescriptionUpdate={updateDescription}
          />
        </div>
      </div>
    </div>
  )
}

export default AddCard
