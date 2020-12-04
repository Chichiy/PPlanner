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

  const renderSwitch = () => {
    switch (props.type) {
      case "cards": {
        return (
          <div className={styles.switchBar}>
            <div className={styles.searchBoard}>
              <BoardSelect type={props.type} />
            </div>

            <div className={styles.searchCard}>
              <CardSelect />
            </div>
          </div>
        )
      }
      case "itineraries": {
        return (
          <div className={styles.switchBar}>
            <div className={styles.searchBoard}>
              <BoardSelect type={props.type} />
            </div>
          </div>
        )
      }
      case "expenditure": {
        return (
          <div className={styles.switchBar}>
            <div className={styles.searchBoard}>
              <BoardSelect type={props.type} />
            </div>
          </div>
        )
      }
      case "todoList": {
        return (
          <div className={styles.switchBar}>
            <div className={styles.searchBoard}>
              <BoardSelect type={props.type} />
            </div>
          </div>
        )
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
        <div className={styles.space}></div>
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

const BoardSelect = (props) => {
  let history = useHistory()
  let match = useRouteMatch()
  let itineraryId = useSelector((state) => state.itinerary.id)
  let location = useLocation()
  let { projectId } = useParams()

  // console.log(match)

  let options = [
    { value: "cards", label: "卡片板" },
    { value: "itineraries", label: "行程板" },
    { value: "expenditure", label: "花費板" },
    { value: "todoList", label: "待辦清單" },
  ]
  const thisBoard = () => {
    return options.findIndex((option) => option.value === props.type)
  }

  const handleChange = (e) => {
    //update URL
    let boardType = e.value
    let location
    switch (boardType) {
      case "itineraries": {
        location = {
          pathname: `/projects/${match.params.projectId}/${boardType}/${itineraryId}`,
        }
        break
      }
      default: {
        location = {
          pathname: `/projects/${match.params.projectId}/${boardType}`,
        }
      }
    }
    history.push(location)
  }

  return (
    <Select
      options={options}
      value={options[thisBoard()]}
      onChange={handleChange}
    />
  )
}

const CardSelect = () => {
  let history = useHistory()
  let match = useRouteMatch()

  let location = useLocation()
  let { projectId } = useParams()
  const animatedComponents = makeAnimated()

  console.log("fire2")

  //prepare options
  let cards = useSelector((state) => state.cards)
  let [options, setOptions] = useState([])

  useEffect(() => {
    let tags = cards.reduce(function (prev, curr) {
      return [...prev, ...curr.tags]
    }, [])

    const capitalize = (string) => {
      return string.slice(0, 1).toUpperCase() + string.slice(1)
    }
    let temp = []
    tags.forEach((tag) => {
      temp.push({
        value: tag,
        label: capitalize(tag),
      })
      setOptions(temp)
    })
  }, [cards])

  //get searched tags from URL
  const useQuery = () => {
    let tagString = new URLSearchParams(useLocation().search).get("tag")
    return tagString ? tagString.split(" ") : null
  }
  let searchTags = useQuery()
  const handleValue = () => {
    return searchTags
      ? options.filter((option) => searchTags.includes(option.value))
      : null
  }

  //update URL when search
  const handleChange = (e) => {
    let params = []
    let location
    if (e) {
      e.forEach((tag) => {
        params.push(tag.value)
      })
      location = {
        pathname: `${match.url}/`,
        search: `?tag=${params.join("+")}`,
        state: { tags: params },
      }
    } else {
      location = {
        pathname: `${match.url}`,
        state: { tags: false },
      }
    }
    history.push(location)
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
