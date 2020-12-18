import React, { useState, useEffect, useRef } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import styles from "./projects.module.scss"

import Navbar from "../Navbar/Navbar"
import Project from "./Project"

import {
  listenToProjects,
  addProject_Fs,
  removeProject_Fs,
} from "../../firebase/Config"
import { addProjects, modifyProjects, removeProjects } from "./projectsSlice"
const Projects = () => {
  const dispatch = useDispatch()
  const match = useRouteMatch()
  const projects = useSelector((state) => state.projects)
  const userId = useSelector((state) => state.user.id)

  console.log(userId)
  const handleAddProject = (res) => {
    dispatch(addProjects(res))
  }

  const handleModifyProject = (res) => {
    dispatch(modifyProjects(res))
  }

  const handleRemoveProject = (res) => {
    dispatch(removeProjects(res))
  }

  //init and listen to changes
  useEffect(() => {
    const unsubscribe = listenToProjects(
      userId,
      handleAddProject,
      handleModifyProject,
      handleRemoveProject
    )
    return unsubscribe
  }, [])

  const history = useHistory()
  const [isConfirming, setConfirm] = useState(false)

  const handleToProject = (e, projectId) => {
    if (e.target.ariaLabel === "removeBtn") {
      setConfirm(projectId)
    } else {
      let location = {
        pathname: `${match.url}/${projectId}`,
      }
      history.push(location)
    }
  }

  const handleClickOnConfirm = (e) => {
    if (e.target.ariaLabel === "remove") {
      removeProject_Fs(isConfirming)
      setConfirm(false)
    }
    if (
      e.target.ariaLabel === "cancel" ||
      e.target.ariaLabel === "background"
    ) {
      setConfirm(false)
    }
  }

  return (
    <div className={styles.view}>
      <Switch>
        <Route exact path={match.path}>
          {/* projects page */}

          <Navbar type="default" />
          <div className={styles.container}>
            {/* projects sections */}
            {projects.map((project) => {
              // console.log(project)
              return (
                // <Link to={`${match.url}/${project.id}`} >
                <div
                  key={project.id}
                  className={styles.project}
                  onClick={(e) => handleToProject(e, project.id)}
                >
                  <div
                    aria-label="removeBtn"
                    className={styles.removeProject}
                  ></div>
                  <span className={styles.projectTitle}>{project.title}</span>
                </div>
                // </Link>
              )
            })}

            {/* new project */}

            <AddProject userId={userId} />

            {/* pop-up confirmation  */}
            {isConfirming && (
              <div
                aria-label="background"
                className={styles.background}
                onClick={(e) => handleClickOnConfirm(e)}
              >
                <div className={styles.confirm_container}>
                  <div className={styles.text}>
                    執行刪除後將無法復原
                    <br />
                    您確定要刪除這個旅行計劃嗎？
                  </div>

                  <div className={styles.tools}>
                    <div aria-label="remove" className={styles.removeBtn}>
                      刪除
                    </div>
                    <div aria-label="cancel" className={styles.cancelBtn}>
                      取消
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Route>

        {/* project page */}
        <Route path={`${match.path}/:projectId`}>
          <Project />
        </Route>
      </Switch>
    </div>
  )
}

export default Projects

const AddProject = ({ userId }) => {
  const [isEditing, setEditing] = useState(false)
  const [pendingTitle, setPendingTitle] = useState("")
  const [pendingMember, setPendingMember] = useState([])

  let projectFormat = {
    creater: "",
    title: "",
    members: [],
    tags: [
      {
        color: "orange",
        name: "",
        id: nanoid(5),
      },
      {
        color: "blue",
        name: "",
        id: nanoid(5),
      },
      {
        color: "yellow",
        name: "",
        id: nanoid(5),
      },
      {
        color: "pink",
        name: "",
        id: nanoid(5),
      },
      {
        color: "green",
        name: "",
        id: nanoid(5),
      },
    ],
    created_time: null,
  }

  const handleAddProject = () => {
    if (pendingTitle === "") {
      document.querySelector("#inputTitle").focus()
    } else {
      projectFormat.creater = userId
      projectFormat.title = pendingTitle
      projectFormat.members.push(userId)
      projectFormat.created_time = new Date()
      addProject_Fs(projectFormat)
      setEditing(!isEditing)
      setPendingTitle("")
    }
  }

  return (
    <div
      className={styles.addProject_container}
      onClick={() => {
        !isEditing && setEditing(!isEditing)
      }}
    >
      {!isEditing ? (
        <span className={styles.projectTitle}>新增旅行</span>
      ) : (
        <div className={styles.addProject}>
          {/* <div className={styles.header}>
        
          </div> */}
          <div className={styles.main}>
            <div className={styles.row}>
              <div className={styles.caption}>旅行名稱</div>
              <input
                id="inputTitle"
                type="text"
                value={pendingTitle}
                onChange={(e) => {
                  setPendingTitle(e.target.value)
                }}
                placeholder="請輸入計劃名稱"
                autoFocus
              />
            </div>
          </div>
          <div className={styles.bottom}>
            <div
              className={styles.cancel}
              onClick={() => {
                setEditing(!isEditing)
              }}
            >
              取消
            </div>
            <div className={styles.next} onClick={handleAddProject}>
              繼續
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
