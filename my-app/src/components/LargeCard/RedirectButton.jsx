import React from "react"
import { useParams, Route, Switch, useHistory } from "react-router-dom"
import styles from "./LargeCard.module.scss"

const RedirectButton = ({ card }) => {
  const { projectId } = useParams()
  const history = useHistory()

  const handleRedirect = (type, card) => {
    if (type === "itinerary") {
      // let startDate = resetTime(new Date(card.start_time))
      // let location = {
      //   pathname: `/projects/${projectId}/itineraries`,
      //   state: { startDate: startDate },
      // }
      // history.push(location)
      history.push(`/projects/${projectId}/itineraries`)
    }

    if (type === "cards") {
      let location = {
        pathname: `/projects/${projectId}/cards`,
      }
      history.push(location)
    }
  }

  return (
    <Switch>
      <Route path="/projects/:projectId/cards/:cardId">
        <div
          aria-label="redirect"
          className={styles.sidebar_button_redirect__itinerary}
          onClick={() => {
            handleRedirect("itinerary", card)
          }}
        >
          前往行程板
        </div>
      </Route>
      <Route path="/projects/:projectId/itineraries/:cardId">
        <div
          aria-label="redirect"
          className={styles.sidebar_button_redirect__itinerary}
          onClick={() => {
            handleRedirect("cards", card)
          }}
        >
          前往卡片板
        </div>
      </Route>
    </Switch>
  )
}

export default RedirectButton
