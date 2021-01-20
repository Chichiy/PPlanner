import React from "react"
import { useParams, useHistory } from "react-router-dom"
import styles from "./LargeCard.module.scss"

const RedirectButton = () => {
  const { projectId, boardType } = useParams()
  const history = useHistory()

  const handleRedirect = () => {
    if (boardType === "itineraries") {
      history.push(`/projects/${projectId}/cards`)
    }

    if (boardType === "cards") {
      history.push(`/projects/${projectId}/itineraries`)
    }
  }

  return (
    <div
      aria-label="redirect"
      className={styles.sidebar_button_redirect__itinerary}
      onClick={handleRedirect}
    >
      前往{boardType === "cards" ? "行程板" : "卡片板"}
    </div>
  )
}

export default RedirectButton
