import React from "react"
import { useSelector } from "react-redux"
import styles from "./Popup.module.scss"
import { useHistory } from "react-router-dom"
import { signOut } from "../../firebase/Config"
import { getColor } from "../../utils/lib"
import SignUp from "./SignUp"
import SignIn from "./SignIn"

const Modal = ({ isShowing, setShowing, children }) => {
  const user = useSelector((state) => state.user)
  const history = useHistory()

  const toProjects = () => {
    history.push({
      pathname: "/projects",
    })
    setShowing(false)
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

  //close sign in block
  const closePopUp = (e) => {
    let triggerElementId = ["closeBtn", "popupBackground_default"]

    if (triggerElementId.includes(e.target.id)) {
      console.log(e)
      setShowing(false)
    }
  }

  const content = () => {
    switch (isShowing) {
      case "signIn": {
        return <SignIn closePopUp={closePopUp} setShowing={setShowing} />
      }

      case "signUp": {
        return <SignUp closePopUp={closePopUp} setShowing={setShowing} />
      }

      case "user": {
        return (
          <div className={styles.user_container}>
            <div className={styles.userInfo}>
              <div
                className={styles.img_container}
                style={{ backgroundColor: getColor(user.id) }}
              >
                {user.name[0]}
              </div>
              <div className={styles.user_name}>{user.name}</div>
              <div className={styles.user_email}>{user.email}</div>
            </div>
            <div className={styles.tools}>
              <div className={styles.project} onClick={toProjects}>
                管理您的旅行計畫
              </div>
              <div className={styles.sign_out_btn} onClick={handleSignOut}>
                登出
              </div>
            </div>
          </div>
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <div
      id="popupBackground_signIn"
      className={styles.popUpBackground}
      onClick={closePopUp}
    >
      <div className={styles.popUpContainer}>
        <div id="closeBtn" className={styles.close}>
          X
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
