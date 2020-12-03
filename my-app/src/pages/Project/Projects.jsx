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
import ItineraryBoard from "./feature/itineraryBoard/ItineraryBoard"

const Projects = () => {
  let match = useRouteMatch()
  let projects = useSelector((state) => state.projects)
  let itineraryId = useSelector((state) => state.itinerary.id)

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
