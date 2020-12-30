import React from "react"
import { useParams } from "react-router-dom"
import styles from "./Navbar.module.scss"

const InvitationButton = ({ isShowing, setShowing }) => {
  const { projectId } = useParams()

  const getUrl = () => {
    let url = window.location.origin
    return url + `/joinProject/${projectId}`
  }
  const handleFocus = (e) => {
    e.target.select()
  }

  const handleCopy = () => {
    let copyText = document.querySelector("#url")
    copyText.select()
    copyText.setSelectionRange(0, 99999) /* For mobile devices */
    document.execCommand("copy")
    setShowing(false)
  }

  const clickOnInvitation = (e) => {
    if (isShowing !== "invitation") {
      setShowing("invitation")
    } else if (e.target.id === "invitation") {
      setShowing(false)
    }
  }

  return (
    <div
      id="invitation"
      className={styles.invitation}
      onClick={clickOnInvitation}
    >
      邀請
      {isShowing === "invitation" && (
        <div className={styles.invitation_container}>
          <div className={styles.caption}>邀請好友加入</div>
          <input
            id="url"
            className={styles.url}
            type="text"
            value={getUrl()}
            autoFocus
            readOnly
            onFocus={handleFocus}
          />
          <div className={styles.buttons}>
            <div className={styles.copy_button} onClick={handleCopy}>
              點擊複製連結
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvitationButton
