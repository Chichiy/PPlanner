import React, { useState, useEffect } from "react"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import styles from "./navbar.module.scss"

import Title from "./component/Title"

const Navbar = (props) => {
  let [login, setLogin] = useState(true)
  let { projectId } = useParams()
  let match = useRouteMatch()
  let thisProject = (state) =>
    state.projects.find((project) => project.id === projectId)
  let project = useSelector(thisProject)

  // console.log(match)
  // console.log("rerender")
  // console.log(props.type)

  const renderSwitch = () => {
    switch (props.type) {
      case "cards": {
        return (
          <div className={styles.searchCard}>
            <CardSelect />
          </div>
        )
      }
      case "itineraries": {
        return <div>itineraries</div>
      }
      case "expenditure": {
        return <div>expenditure</div>
      }
      case "todoList": {
        return <div>todoList</div>
      }
      default: {
        return null
      }
    }
  }

  if (login) {
    return (
      <div className={styles.navBar}>
        <Link to="/" className={styles.item}>
          Logo
        </Link>
        <Switch>
          <Route path={`/projects/${projectId}`}>
            <Title
              title={project ? project.title : null}
              projectId={project ? project.id : null}
            />
          </Route>
        </Switch>

        {renderSwitch()}

        <Link to="/user" className={styles.button_border}>
          User
        </Link>
      </div>
    )
  } else {
    //not Login
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
}

export default Navbar

const CardSelect = () => {
  let history = useHistory()
  let match = useRouteMatch()
  let location = useLocation()
  let { projectId } = useParams()

  // console.log(match)

  const animatedComponents = makeAnimated()
  let options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ]
  const useQuery = () => {
    let tagString = new URLSearchParams(useLocation().search).get("tag")
    return tagString ? tagString.split(" ") : null
  }

  let tags = useQuery()

  const handleValue = () => {
    return tags ? options.filter((option) => tags.includes(option.value)) : null
  }

  const handleChange = (e) => {
    //update URL
    let params = []
    let location
    if (e) {
      e.forEach((tag) => {
        params.push(tag.value)
      })
      location = {
        pathname: `${match.url}/`,
        search: `?tag=${params.join("+")}`,
      }
    } else {
      location = {
        pathname: `${match.url}`,
      }
    }
    history.push(location)

    //showCards
  }

  return (
    <Select
      isMulti
      options={options}
      value={handleValue()}
      onChange={handleChange}
      closeMenuOnSelect={false}
      components={animatedComponents}
      placeholder="搜尋卡片標籤"
    />
  )
}
