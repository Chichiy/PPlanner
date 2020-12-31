import React, { useState, useEffect } from "react"
import { Link, useLocation, Route, Switch } from "react-router-dom"
import styles from "./Navbar.module.scss"
import ProjectTitle from "./ProjectTitle"
import FeatureBar from "./FeatureBar"
import InvitationButton from "./InvitationButton"
import UserButton from "./UserButton"
import Popup from "../Popup/Popup"

const Navbar = () => {
  const location = useLocation()
  const [isShowing, setShowing] = useState(false)
  const checkShouldShowPopup = () => {
    const shouldShowPopup = location.state?.showPopup
    shouldShowPopup && setShowing(shouldShowPopup)
  }

  useEffect(checkShouldShowPopup, [location])

  return (
    <div className={styles.navbar}>
      <Switch>
        <Route path={`/projects/:projectId/:boardType`}>
          <Link to="/projects" className={styles.home}>
            <div className={styles.tooltip_text}>返回總覽</div>
          </Link>
          <ProjectTitle />
          <FeatureBar />
          <InvitationButton isShowing={isShowing} setShowing={setShowing} />
        </Route>

        <Route path="/">
          <Link to="/projects" className={styles.logo}></Link>
        </Route>
      </Switch>

      <div className={styles.space}></div>
      <UserButton isShowing={isShowing} setShowing={setShowing} />

      {isShowing && <Popup isShowing={isShowing} setShowing={setShowing} />}
    </div>
  )
}

export default Navbar
