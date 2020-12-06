import React, { useState, useEffect } from "react"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import styles from "../navbar.module.scss"

import { updateProjectTitle_Fs } from "../../../firebase/Config"
import { editProjectTitle } from "../../Project/projectsSlice"

const Title = ({ projectId, title }) => {
  let projectTitle = title ? title : null
  let [isEditing, setEditing] = useState(false)
  let [pending, setPending] = useState(projectTitle)

  let dispatch = useDispatch()

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      //update cloud data
      updateProjectTitle_Fs(projectId, e.target.value)

      //change local data
      dispatch(
        editProjectTitle({
          projectId: projectId,
          newTitle: e.target.value,
        })
      )
      setEditing(!isEditing)
    }
  }

  if (!isEditing) {
    return (
      <div
        className={styles.item}
        onClick={() => {
          setEditing(!isEditing)
        }}
      >
        {pending}
      </div>
    )
  } else {
    return (
      <input
        type="text"
        className={styles.editTitle}
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
        autoFocus
      />
    )
  }
}

export default Title
