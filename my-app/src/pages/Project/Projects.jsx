import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import styles from "./projects.module.scss"

import Navbar from "../Navbar/Navbar"
import Project from "./Project"

import { getFsData_Projects, listenToProjects } from "../../firebase/Config"
import { addProjects, modifyProjects, removeProjects } from "./projectsSlice"
const Projects = () => {
  console.log("render projects")
  let dispatch = useDispatch()
  let match = useRouteMatch()
  let projects = useSelector((state) => state.projects)
  let userId = useSelector((state) => state.user.id)

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
    listenToProjects(
      userId,
      handleAddProject,
      handleModifyProject,
      handleRemoveProject
    )
  }, [])

  return (
    <div className={styles.view}>
      <Switch>
        <Route exact path={match.path}>
          <Navbar type="default" />
          <div className={styles.container}>
            {projects.map((project) => {
              return (
                <Link to={`${match.url}/${project.id}`} key={project.id}>
                  <div className={styles.project}>
                    <span className={styles.projectTitle}>{project.title}</span>
                  </div>
                </Link>
              )
            })}
            <Link to={`${match.url}`} key={nanoid()}>
              <div className={styles.addProject}>
                <span className={styles.projectTitle}>新增旅行</span>
              </div>
            </Link>
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
