import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

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

import {
  signIn_Native,
  signUp_Native,
  checkUserStatus,
  listenToUser,
  signOut,
} from "../../firebase/Config"
import { getColor } from "../lib"
import { initUser } from "../User/userSlice"

const User = ({ type, showUserPage, setShowing }) => {
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
    let triggerElementId = ["closeBtn", "popUpBackground"]

    if (triggerElementId.includes(e.target.id)) {
      setShowing(false)
    }
  }

  const content = () => {
    switch (type) {
      case "signIn": {
        return <SignIn closePopUp={closePopUp} setShowing={setShowing} />
      }

      case "signUp": {
        return <SignUp closePopUp={closePopUp} setShowing={setShowing} />
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
              <div className={styles.sign_out_btn} onClick={handleSignOut}>
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
      id="popUpBackground"
      className={styles.popUpBackground}
      onClick={closePopUp}
    >
      <div className={styles.popUpContainer}>
        <div id="closeBtn" className={styles.close}>
          X
        </div>
        <div className={styles.logo}>LOGO</div>
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
            利用現有帳戶登入
          </div>
          <div className={styles.signIn} onClick={handleSignUp}>
            繼續
          </div>
        </div>
      </div>
    </div>
  )
}

const SignIn = ({ closePopUp, setShowing }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    signIn_Native(email, password)
  }

  return (
    <div
      id="popUpBackground"
      className={styles.popUpBackground}
      onClick={closePopUp}
    >
      <div className={styles.popUpContainer}>
        <div id="closeBtn" className={styles.close}>
          X
        </div>
        <div className={styles.logo}>LOGO</div>
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

export const CheckUser = () => {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleUpdate = (res) => {
    dispatch(initUser(res))
  }

  const handleUser = (currentUser) => {
    if (user.id !== currentUser.uid) {
      listenToUser(currentUser.uid, handleUpdate)
    }
  }

  const handleNoUser = () => {
    let location = {
      pathname: `/`,
    }

    history.push(location)
  }

  //check login
  checkUserStatus(handleUser, handleNoUser)

  // useEffect(()=>{

  //   const unsubscribe=listenToUser()

  //   return unsubscribe
  // },[])

  return <div></div>
}
