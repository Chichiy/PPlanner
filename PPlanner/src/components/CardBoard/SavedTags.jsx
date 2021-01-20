import React from "react"
import { useSelector } from "react-redux"
import { nanoid, createSelector } from "@reduxjs/toolkit"
import { useParams } from "react-router-dom"
import styles from "./CardBoard.module.scss"
import { colorCode } from "../../utils/lib"

const SavedTags = ({ tags }) => {
  const { projectId } = useParams()
  const selectProjectTags = createSelector(
    (state) => state.projects,
    (projects) =>
      projects.find((project) => project.id === projectId)?.tags ?? []
  )
  const projectTags = useSelector(selectProjectTags)

  return tags.length > 0
    ? tags.map((tag) => {
        const target = projectTags.find((item) => item.id === tag)
        return (
          <div
            key={tag}
            style={{ backgroundColor: colorCode[target?.color] }}
            className={styles.small_card_icon__tag}
          ></div>
        )
      })
    : null
}

const MemorizeSavedTags = React.memo(SavedTags)
export default MemorizeSavedTags
