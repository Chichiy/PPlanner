import React, { useState } from "react"
import styles from "./Popup.module.scss"
import { signIn_Native } from "../../firebase/lib"

const SignIn = ({ closePopUp, setShowing }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    let input = {
      email: email,
      password: password,
    }

    const handleSuccess = () => {
      setShowing(false)
    }

    signIn_Native(input, handleSuccess)
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
        <div className={styles.logo}></div>
        <div className={styles.title}>登入</div>
        <input
          type="text"
          placeholder="請輸入電子郵件地址"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <input
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <div className={styles.bottom}>
          <div
            className={styles.toSignUp}
            onClick={() => {
              setShowing("signUp")
            }}
          >
            建立新帳戶
          </div>
          <div className={styles.signIn} onClick={handleSignIn}>
            繼續
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
