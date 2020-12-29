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
  getProject_Fs,
  updateProjectMember_Fs,
  addProjectInUser_Fs,
} from "../../firebase/Config"
import { getColor } from "../lib"
import { initUser } from "../User/userSlice"

const User = ({ isShowing, setShowing }) => {
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
    let triggerElementId = [
      "closeBtn",
      "popupBackground_default",
      // "popupBackground_signIn",
      // "popupBackground_signUp",
    ]

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
      default: {
        return null
      }
    }
  }

  return (
    <div
      id="popupBackground_default"
      className={styles.popup_background}
      onClick={closePopUp}
    >
      {content()}
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

export const CheckUser = () => {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const handleUpdate = (res) => {
    dispatch(initUser(res))
  }

  const handleUser = (currentUser) => {
    if (user.id !== currentUser.uid) {
      listenToUser(currentUser.uid, handleUpdate)
    }
  }

  const handleNoUser = () => {
    //allow page to show and then ask user to login
    if (location.pathname.slice(1, 12) === "joinProject") {
    }

    //redirect to home page if not invited
    if (location.pathname.slice(1, 12) !== "joinProject") {
      history.push("/")
    }
  }

  //check login
  useEffect(() => {
    checkUserStatus(handleUser, handleNoUser)
  }, [])

  // useEffect(()=>{

  //   const unsubscribe=listenToUser()

  //   return unsubscribe
  // },[])

  return <div></div>
}

export const Join = () => {
  const { projectId } = useParams()
  const user = useSelector((state) => state.user)
  const [popUp, setPopUp] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    // if (user.id) {

    //check if link is valid
    getProject_Fs(projectId).then((res) => {
      if (res) {
        setProjectTitle(res.title)
      } else {
        alert("Oops! 這個旅行計劃不存在！")
        history.push("/")
        history.go(0)
      }
    })
    // }
  }, [])

  const handleAccept = () => {
    //accept logged in
    if (user.id) {
      updateProjectMember_Fs(projectId, "add", user.id).then((res) => {
        addProjectInUser_Fs(user.id, projectId).then((res) => {
          history.replace({ pathname: `/projects/${projectId}/cards` })
        })
      })
    } else {
      alert("請先登入會員帳號")
      //show login
      history.push({
        pathname: `${location.pathname}`,
        state: { showPopup: "signIn" },
      })
    }
  }

  const handleCancel = () => {
    //if logged-in, redirect to projects page
    if (user.id) {
      history.replace({ pathname: "/projects" })
    } else {
      //if not, redirect to home page
      history.replace("/")
    }
  }

  return (
    <div className={styles.join_background}>
      {!popUp ? (
        <div className={styles.popUp_container}>
          <div className={styles.text}>
            您受到邀請加入
            <br />
            {projectTitle} 的旅行計劃，
            <br />
            確定要加入嗎？
          </div>

          <div className={styles.tools}>
            <div className={styles.cancel} onClick={handleCancel}>
              拒絕
            </div>
            <div className={styles.join} onClick={handleAccept}>
              加入
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
