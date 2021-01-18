import React from "react"
import { useSelector } from "react-redux"
import styles from "./LargeCard.module.scss"
import { colorCode, getCategoryTitle } from "../../utils/lib"

const Tags = ({ projectId, card, setFloat }) => {
  const project = useSelector((state) =>
    state.projects.find((project) => project.id === projectId)
  )

  const toggleAddTag = (e) => {
    let float = {
      type: "addTag",
      position: e.target.getBoundingClientRect(),
    }

    setFloat(float)
  }

  const toggleChangeMainTag = (e) => {
    let float = {
      type: "changeMainTag",
      position: e.target.getBoundingClientRect(),
    }

    setFloat(float)
  }
  try {
    return (
      <div className={styles.tags_section}>
        <div className={styles.title}>標籤</div>
        <div className={styles.container}>
          {/* category tag */}
          <div
            aria-label="addTag" //need to be able to change category
            className={styles.tag}
            style={{ backgroundColor: colorCode[card.category] }}
            onClick={toggleChangeMainTag}
          >
            {getCategoryTitle(card.category)}
          </div>

          {/* regular tags */}
          {card.tags.map((tag) => {
            const target = project.tags.find((item) => item.id === tag)

            return (
              <div
                aria-label="addTag"
                key={tag}
                className={styles.tag}
                style={{
                  backgroundColor: colorCode[target.color],
                }}
                onClick={toggleAddTag}
              >
                {target.name}
              </div>
            )
          })}

          <div
            aria-label="addTag"
            className={styles.tag}
            onClick={toggleAddTag}
          >
            +
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.log(err.message)
    return null
  }
}

export default Tags
