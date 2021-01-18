import React, { useState } from "react"

import styles from "./Popup.module.scss"

import { signUp_Native } from "../../firebase/lib"

const SignUp = ({ closePopUp, setShowing }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignUp = () => {
    const handleSuccess = () => {
      setShowing(false)
    }

    let input = {
      email: email,
      password: password,
      name: name,
    }
    signUp_Native(input, handleSuccess)
  }

  return (
    <div
      id="popupBackground_signUp"
      className={styles.popUpBackground}
      onClick={closePopUp}
    >
      <div className={styles.popUpContainer}>
        <div id="closeBtn" className={styles.close}>
          X
        </div>
        <div className={styles.logo}></div>
        <div className={styles.title}>註冊</div>
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
        <input
          type="text"
          placeholder="請輸入用戶暱稱"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <div className={styles.bottom}>
          <div
            className={styles.toSignUp}
            onClick={() => {
              setShowing("signIn")
            }}
          >
            以現有帳戶登入
          </div>
          <div className={styles.signIn} onClick={handleSignUp}>
            繼續
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
