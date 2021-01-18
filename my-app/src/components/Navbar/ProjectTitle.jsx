import React, { useState, useEffect } from "react"
import { createSelector } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { FS } from "../../firebase/lib"
import styles from "./Navbar.module.scss"

const ProjectTitle = () => {
  const { projectId } = useParams()
  const selectProjectTitle = createSelector(
    (state) => state.projects,
    (projects) =>
      projects.find((project) => project.id === projectId)?.title ?? ""
  )
  const projectTitle = useSelector(selectProjectTitle)
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState("")

  useEffect(() => {
    setPending(projectTitle)
  }, [projectTitle])

  const handleTitleEditing = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      const change = {
        title: e.target.value,
      }
      FS.projects.update(projectId, change)
      setEditing(!isEditing)
    }
  }

  if (!isEditing) {
    return (
      <div
        className={styles.project_title}
        onClick={() => {
          setEditing(!isEditing)
        }}
      >
        {projectTitle}
        <div className={styles.tooltip_text}>編輯名稱</div>
      </div>
    )
  } else {
    return (
      <input
        autoFocus
        type="text"
        className={styles.project_title__edit}
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEditing}
        onKeyPress={handleTitleEditing}
      />
    )
  }
}

export default ProjectTitle
