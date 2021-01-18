import React, { useRef, useState } from "react"
import styles from "./Projects.module.scss"
import { addProject_Fs, updateProjectInUser_Fs } from "../../firebase/lib"
import { emptyProject } from "../../utils/lib"

const AddProject = ({ userId }) => {
  const inputTitle = useRef(null)
  const [isEditing, setEditing] = useState(false)
  const [pendingTitle, setPendingTitle] = useState("")

  const handleAddProject = () => {
    if (pendingTitle === "") {
      inputTitle.current.focus()
    } else {
      emptyProject.creater = userId
      emptyProject.title = pendingTitle
      emptyProject.members.push(userId)
      emptyProject.created_time = new Date()
      addProject_Fs(emptyProject).then((res) => {
        updateProjectInUser_Fs(userId, "add", res.id)
      })

      setEditing(!isEditing)
      setPendingTitle("")
    }
  }

  return (
    <div
      className={styles.addProject_container}
      onClick={() => {
        !isEditing && setEditing(!isEditing)
      }}
    >
      {!isEditing ? (
        <span className={styles.projectTitle}>新增旅行</span>
      ) : (
        <div className={styles.addProject}>
          <div className={styles.main}>
            <div className={styles.row}>
              <div className={styles.caption}>旅行名稱</div>
              <input
                autoFocus
                ref={inputTitle}
                id="newProjectTitle"
                type="text"
                value={pendingTitle}
                onChange={(e) => {
                  setPendingTitle(e.target.value)
                }}
                placeholder="請輸入計劃名稱"
              />
            </div>
          </div>
          <div className={styles.bottom}>
            <div
              className={styles.cancel}
              onClick={() => {
                setEditing(!isEditing)
              }}
            >
              取消
            </div>
            <div className={styles.next} onClick={handleAddProject}>
              繼續
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddProject
