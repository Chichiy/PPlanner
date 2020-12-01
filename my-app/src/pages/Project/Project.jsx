import React, { useState, useEffect } from "react"

import stylesMain from "../../scss/project.module.scss"
import styles from "../../scss/itineraryBoard.module.scss"

import Navbar from "../Navbar/Navbar"
import ItineraryBoard from "./feature/itineraryBoard/ItineraryBoard"

const Project = () => {
  return (
    <div id="project">
      <Navbar />
      <ItineraryBoard />
    </div>
  )
}

export default Project
