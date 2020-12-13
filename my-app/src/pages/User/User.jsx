import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import styles from "./user.module.scss"

import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"

import { getColor } from "../lib"

const User = ({ type, showUserPage, setShowing }) => {
  const user = useSelector((state) => state.user)
  const history = useHistory()

  const toProjects = () => {
    history.push({
      pathname: "/projects",
    })
    setShowing(false)
  }

  //close sign in block
  const closeSignIn = (e) => {
    let triggerElementId = ["closeBtn", "signInBackground"]

    if (triggerElementId.includes(e.target.id)) {
      setShowing(false)
    }
  }

  const content = () => {
    switch (type) {
      case "signIn": {
        return (
          <div
            id="signInBackground"
            className={styles.signInBackground}
            onClick={closeSignIn}
          >
            <div className={styles.signInContainer}>
              <div id="closeBtn" className={styles.close}>
                X
              </div>
              <div className={styles.logo}>LOGO</div>
              <div className={styles.title}>登入</div>
              <input type="text" placeholder="請輸入電子郵件地址" />
              <input type="password" placeholder="請輸入密碼" />
              <div className={styles.bottom}>
                <div
                  className={styles.toSignUp}
                  onClick={() => {
                    setShowing("signUp")
                  }}
                >
                  建立新帳戶
                </div>
                <div className={styles.signIn}>繼續</div>
              </div>
            </div>
          </div>
        )
      }
      case "signUp": {
        return (
          <div
            id="signInBackground"
            className={styles.signInBackground}
            onClick={closeSignIn}
          >
            <div className={styles.signInContainer}>
              <div id="closeBtn" className={styles.close}>
                X
              </div>
              <div className={styles.logo}>LOGO</div>
              <div className={styles.title}>登入</div>
              <input type="text" placeholder="請輸入電子郵件地址" />
              <input type="password" placeholder="請輸入密碼" />
              <div className={styles.bottom}>
                <div
                  className={styles.toSignUp}
                  onClick={() => {
                    setShowing("signUp")
                  }}
                >
                  建立新帳戶
                </div>
                <div className={styles.signIn}>繼續</div>
              </div>
            </div>
          </div>
        )
      }
      default: {
        return (
          <div className={styles.user_container}>
            <div className={styles.userInfo}>
              <div
                className={styles.img_container}
                style={{ backgroundColor: getColor(user.id) }}
              >
                {user.name[0]}
                {/* <img src="" alt=""/> */}
              </div>
              <div className={styles.user_name}>{user.name}</div>
              <div className={styles.user_email}>{user.email}</div>
            </div>
            <div className={styles.tools}>
              <div className={styles.project} onClick={toProjects}>
                管理您的旅行計畫
              </div>
              <div
                className={styles.sign_out_btn}
                onClick={() => {
                  setShowing("signIn")
                }}
              >
                登出
              </div>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div className={styles.view}>
      <div className={styles.banner}>{content()}</div>
    </div>
  )
}

export default User
