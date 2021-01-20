import React, { useRef } from "react"
import { useParams } from "react-router-dom"
import styles from "./Navbar.module.scss"
import { getInvitationUrl } from "../../utils/lib"

const InvitationButton = ({ isShowing, setShowing }) => {
  const clickOnInvitation = (e) => {
    if (isShowing !== "invitation") {
      setShowing("invitation")
    } else if (e.target.id === "invitation") {
      setShowing(false)
    }
  }

  const { projectId } = useParams()

  const handleFocus = (e) => {
    e.target.select()
  }

  const url = useRef(null)
  const handleCopyUrl = () => {
    const copyText = url.current
    copyText.select()
    copyText.setSelectionRange(0, 99999) /* For mobile devices */
    document.execCommand("copy")
    setShowing(false)
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
            ref={url}
            autoFocus
            readOnly
            type="text"
            className={styles.url}
            value={getInvitationUrl(projectId)}
            onFocus={handleFocus}
          />
          <div className={styles.buttons}>
            <div className={styles.copy_button} onClick={handleCopyUrl}>
              點擊複製連結
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvitationButton
