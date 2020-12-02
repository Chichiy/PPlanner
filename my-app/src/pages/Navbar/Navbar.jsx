import React, { useState, useEffect } from "react"
import { Link, useRouteMatch, useParams, useLocation } from "react-router-dom"
import styles from "./navbar.module.scss"

const Navbar = () => {
  let location = useLocation()
  console.log(location)

  return (
    <div className={styles.navBar}>
      <ul>
        <li>
          <Link to="/" className={styles.button}>
            Logo
          </Link>
        </li>
        <li>
          <Link to="/signIn" className={styles.button}>
            Sign in
          </Link>
        </li>
        <li>
          <Link to="/signUp" className={styles.button_border}>
            Sign up
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
