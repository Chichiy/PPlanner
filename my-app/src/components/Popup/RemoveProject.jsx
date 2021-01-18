import React from "react"
import styles from "./Popup.module.scss"
import {
  removeProject_Fs,
  updateProjectMember_Fs,
  updateProjectInUser_Fs,
} from "../../firebase/lib"
import { useSelector } from "react-redux"

const RemoveProject = ({ isConfirming, setConfirm }) => {
  const handleClickOnConfirm = (e) => {
    if (e.target.ariaLabel === "remove") {
      if (removeAuthority) {
        removeProject_Fs(isConfirming).then((res) => {
          console.log(res, "fire")
        })
      } else {
        updateProjectMember_Fs(isConfirming, "remove", userId).then(() => {
          updateProjectInUser_Fs(userId, "remove", isConfirming)
        })
      }
      setConfirm(false)
    }
    if (
      e.target.ariaLabel === "cancel" ||
      e.target.ariaLabel === "background"
    ) {
      setConfirm(false)
    }
  }

  const project = useSelector((state) =>
    state.projects.find((project) => project.id === isConfirming)
  )
  const userId = useSelector((state) => state.user?.id)
  const removeAuthority = project.creator_id === userId

  return (
    <div
      aria-label="background"
      className={styles.background}
      onClick={(e) => handleClickOnConfirm(e)}
    >
      <div className={styles.confirm_container}>
        {removeAuthority ? (
          <div className={styles.text}>
            執行刪除後將無法復原，
            <br />
            確定要刪除《{project?.title}》？
          </div>
        ) : (
          <div className={styles.text}>確定要退出《{project?.title}》？</div>
        )}

        <div className={styles.tools}>
          <div aria-label="remove" className={styles.removeBtn}>
            刪除
          </div>
          <div aria-label="cancel" className={styles.cancelBtn}>
            取消
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveProject
