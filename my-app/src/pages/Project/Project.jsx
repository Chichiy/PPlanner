import React, { useState, useEffect } from "react"

import styles from "../../scss/project.module.scss"
import ItineraryBoard from "./feature/itineraryBoard/ItineraryBoard"

const Project = () => {
  return (
    <div id="project" className={styles.project}>
      <ItineraryBoard />
    </div>
  )
}

export default Project
