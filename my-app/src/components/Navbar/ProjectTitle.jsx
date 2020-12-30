import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { updateProject_Fs } from "../../firebase/Config"
import styles from "./Navbar.module.scss"

const ProjectTitle = () => {
  const { projectId } = useParams()
  const thisProject = (state) =>
    state.projects.find((project) => project.id === projectId)
  const project = useSelector(thisProject)

  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState("")

  useEffect(() => {
    try {
      setPending(project.title)
    } catch {}
  }, [project])

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      const change = {
        title: e.target.value,
      }
      updateProject_Fs(projectId, change)
      setEditing(!isEditing)
    }
  }

  if (!isEditing) {
    return (
      <div
        className={`${styles.project_title} ${styles.tooltip}`}
        onClick={() => {
          setEditing(!isEditing)
        }}
      >
        {pending}
        <div className={styles.tooltip_text}>編輯名稱</div>
      </div>
    )
  } else {
    return (
      <input
        type="text"
        className={styles.project_title__edit}
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
        autoFocus
      />
    )
  }
}

export default ProjectTitle
