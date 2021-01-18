import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import styles from "./Popup.module.scss"

import { useParams, useLocation, useHistory } from "react-router-dom"

import {
  getProject_Fs,
  updateProjectMember_Fs,
  updateProjectInUser_Fs,
} from "../../firebase/lib"

export const JoinProject = () => {
  const { projectId } = useParams()
  const user = useSelector((state) => state.user)
  const [popUp, setPopUp] = useState(false)
  const [project, setProject] = useState({})
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    //check if link is valid
    getProject_Fs(projectId).then((res) => {
      if (res) {
        setProject(res)
      } else {
        alert("Oops! 這個旅行計劃不存在！")
        history.push("/")
        history.go(0)
      }
    })
  }, [])

  const handleAccept = () => {
    const hasJoined = project.members.includes(user.id)

    //accept logged in
    if (user.id) {
      if (hasJoined) {
        alert(`您已加入過《${project.title}》`)
        history.replace(`/projects/${projectId}/cards`)
      } else {
        updateProjectMember_Fs(projectId, "add", user.id).then((res) => {
          updateProjectInUser_Fs(user.id, "add", projectId).then((res) => {
            history.replace({ pathname: `/projects/${projectId}/cards` })
          })
        })
      }
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
            <br />《{project.title}》
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

export default JoinProject
