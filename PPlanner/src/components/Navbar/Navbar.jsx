import React, { useState, useEffect } from "react"
import { Link, useLocation, Route, Switch, useParams } from "react-router-dom"
import styles from "./Navbar.module.scss"
import ProjectTitle from "./ProjectTitle"
import FeatureBar from "./FeatureBar"
import InvitationButton from "./InvitationButton"
import UserButton from "./UserButton"
import Popup from "../Popup/Popup"
import MobileMenu from "./MobileMenu"
import { useSelector } from "react-redux"

const Navbar = () => {
  const location = useLocation()
  const [isShowing, setShowing] = useState(false)
  const checkShouldShowPopup = () => {
    const shouldShowPopup = location.state?.showPopup
    shouldShowPopup && setShowing(shouldShowPopup)
  }

  useEffect(checkShouldShowPopup, [location])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const isSignIn = useSelector((state) => state.user.id)

  return (
    <div className={styles.navbar}>
      <Switch>
        <Route path={`/projects/:projectId/:boardType`}>
          <Link to="/projects" className={styles.projects}>
            <div className={styles.tooltip_text}>返回總覽</div>
          </Link>
          <div
            className={styles.mobile_menu_icon}
            onClick={() => {
              setShowMobileMenu(true)
            }}
          ></div>
          <ProjectTitle />
          <FeatureBar />
          <InvitationButton isShowing={isShowing} setShowing={setShowing} />
          <MobileMenu
            isShowing={showMobileMenu}
            setShowing={setShowMobileMenu}
          />
          <div className={styles.space_board}></div>
          <UserButton isShowing={isShowing} setShowing={setShowing} />
        </Route>

        <Route path="/">
          <Link
            to={isSignIn ? "/projects" : "/"}
            className={styles.logo}
          ></Link>
          <div className={styles.space}></div>
          <UserButton isShowing={isShowing} setShowing={setShowing} />
        </Route>
      </Switch>

      {isShowing && <Popup isShowing={isShowing} setShowing={setShowing} />}
    </div>
  )
}

export default Navbar
