import React from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { signOut } from "../../firebase/lib"
import { getColor, getInvitationUrl, copyToClipboard } from "../../utils/lib"
import styles from "./Navbar.module.scss"

const MobileMenu = ({ isShowing, setShowing }) => {
  const user = useSelector((state) => state.user)
  const history = useHistory()

  const toProjects = () => {
    setShowing(false)
    setTimeout(() => history.push("/projects"), 1000)
  }

  const handleSignOut = () => {
    const backToHome = () => {
      history.push({
        pathname: "/",
      })
      history.go(0)
    }

    signOut(backToHome)
  }

  const { projectId, boardType } = useParams()

  const handleRedirct = () => {
    setShowing(false)
    if (boardType === "cards") {
      history.push(`/projects/${projectId}/itineraries`)
    } else {
      history.push(`/projects/${projectId}/cards`)
    }
  }

  const handleCopyUrl = () => {
    copyToClipboard(getInvitationUrl(projectId))
    setShowing(false)
  }

  return (
    <div className={styles.mobile_menu}>
      <div className={isShowing ? styles.container : styles.container__closed}>
        <div
          className={styles.close}
          onClick={() => {
            setShowing(false)
          }}
        ></div>
        <div className={styles.caption}>導覽列</div>
        <div className={styles.tools}>
          <div className={styles.button_redirect} onClick={handleRedirct}>
            前往{boardType === "cards" ? "行程板" : "卡片板"}
          </div>
          <div className={styles.button_addlink} onClick={handleCopyUrl}>
            複製邀請連結
          </div>
        </div>
        <div className={styles.user}>
          <div className={styles.info}>
            <div
              className={styles.img}
              style={{ backgroundColor: getColor(user.id) }}
            >
              {user.name[0]}
            </div>
            <div className={styles.details}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.email}>{user.email}</div>
            </div>
          </div>
          <div className={styles.tools}>
            <div className={styles.button_manage} onClick={toProjects}>
              管理您的旅行計劃
            </div>
            <div className={styles.button_signout} onClick={handleSignOut}>
              登出
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MobileMenu
