import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import CheckUser from "./CheckUser"
import JoinProject from "../Popup/JoinProject"
import Navbar from "../Navbar/Navbar"
import Projects from "../Projects/Projects"
import Landing from "../Landing/Landing"
import "./reset.module.scss"

export default function App() {
  return (
    <Router>
      <CheckUser />
      <Switch>
        <Route path="/joinProject/:projectId">
          <Navbar />
          <JoinProject />
        </Route>

        <Route path="/projects">
          <Projects />
        </Route>

        <Route path="/">
          <Navbar />
          <Landing />
        </Route>
      </Switch>
    </Router>
  )
}
