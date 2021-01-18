import React, { useState, useEffect } from "react"
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import styles from "./Projects.module.scss"

import Navbar from "../Navbar/Navbar"
import Project from "./Project"
import AddProject from "./AddProject"
import RemoveProject from "../Popup/RemoveProject"

import { listenToProjects2 } from "../../firebase/lib"
import { updateProjects } from "../../redux/slices/projectsSlice"
import { getGradient } from "../../utils/lib"

const Projects = () => {
  const dispatch = useDispatch()
  const match = useRouteMatch()
  const projects = useSelector((state) => state.projects)
  const userId = useSelector((state) => state.user.id)

  const handleUpdate = (res) => {
    dispatch(updateProjects(res))
  }

  useEffect(() => {
    const unsubscribe = userId
      ? listenToProjects2(userId, handleUpdate)
      : () => {}

    return () => {
      unsubscribe()
    }
  }, [userId])

  const history = useHistory()
  const [isConfirming, setConfirm] = useState(false)

  const handleToProject = (e, projectId) => {
    if (e.target.ariaLabel === "removeBtn") {
      setConfirm(projectId)
    } else {
      let location = {
        pathname: `${match.url}/${projectId}/cards`,
      }
      history.push(location)
    }
  }

  return (
    <div className={styles.view}>
      <Switch>
        <Route exact path={match.path}>
          <Navbar />
          <div className={styles.container}>
            {projects.map((project) => {
              return (
                <div
                  key={project.id}
                  style={getGradient(project.id)}
                  className={styles.project}
                  onClick={(e) => handleToProject(e, project.id)}
                >
                  <div
                    aria-label="removeBtn"
                    className={styles.removeProject}
                  ></div>
                  <span className={styles.projectTitle}>{project.title}</span>
                </div>
              )
            })}

            <AddProject userId={userId} />

            {isConfirming && (
              <RemoveProject
                isConfirming={isConfirming}
                setConfirm={setConfirm}
              />
            )}
          </div>
        </Route>

        <Route path={`${match.path}/:projectId`}>
          <Project />
        </Route>
      </Switch>
    </div>
  )
}

export default Projects
