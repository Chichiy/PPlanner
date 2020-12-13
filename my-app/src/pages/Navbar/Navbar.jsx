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

//React Select
import Select from "react-select"
import makeAnimated from "react-select/animated"

//DatesPicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import styles from "./navbar.module.scss"
import User from "../User/User"
import Title from "./component/Title"
import { getColor } from "../lib"

const Navbar = (props) => {
  const user = useSelector((state) => state.user)
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
            <div className={styles.daySelect_container}>
              <DaySelect />
            </div>
            {/* <div className={styles.modeSelect}>
              <ModeSelect />
            </div> */}
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
  const [showUserPage, setShowing] = useState(false)

  const handleUserBtn = () => {
    if (!showUserPage) {
      setShowing("user")
    }
    if (showUserPage === "user") {
      setShowing(false)
    }
  }

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

      {login ? (
        <div
          className={styles.userBtn}
          onClick={handleUserBtn}
          style={{ backgroundColor: getColor(user.id) }}
        >
          {user.name[0]}
        </div>
      ) : (
        <div>
          <div
            className={styles.button}
            onClick={() => {
              setShowing("signIn")
            }}
          >
            Sign in
          </div>

          <div
            className={styles.colorBtn}
            onClick={() => {
              setShowing("signUp")
            }}
          >
            Sign up
          </div>
        </div>
      )}

      {showUserPage && (
        <User
          type={showUserPage}
          showUserPage={showUserPage}
          setShowing={setShowing}
        />
      )}
    </div>
  )
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

const DaySelect = () => {
  const restTime = (date) => {
    let temp = new Date(date.getTime())
    temp.setHours(0)
    temp.setMinutes(0)
    temp.setMilliseconds(0)
    return temp
  }

  const plannedCards = useSelector((state) => state.cards).filter(
    (card) => card.status === 1
  )
  const [startDate, setStartDate] = useState(restTime(new Date()))

  useEffect(() => {
    if (plannedCards.length > 0) {
      setStartDate(restTime(new Date(plannedCards[0].start_time)))
    }
  }, [plannedCards[0]])

  //update start date through location.state
  let history = useHistory()
  let match = useRouteMatch()
  let location = useLocation()

  const handleDateChange = () => {
    location = {
      pathname: `${match.url}`,
      state: { startDate: startDate },
    }
    history.push(location)
  }
  useEffect(() => {
    handleDateChange()
  }, [startDate])

  //show dates with plans

  const getDate = (type, string) => {
    switch (type) {
      case "dateObj": {
        let time = new Date(string)
        return time
      }

      case "date": {
        let time = new Date(string)
        return time.getDate()
      }
      case "month": {
        let time = new Date(string)
        return time.getMonth()
      }
      case "year": {
        let time = new Date(string)
        return time.getFullYear()
      }
      default: {
        break
      }
    }
  }

  const hasPlan = (date) => {
    if (
      plannedCards.findIndex(
        (card) =>
          getDate("dateObj", card.start_time) - date < 24 * 60 * 60 * 1000 &&
          getDate("dateObj", card.start_time) - date > 0
      ) > -1
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      className={styles.daySelect}
      dateFormat="yyyy/MM/dd"
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "10px, 5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: "viewport",
        },
      }}
      wrapperClassName={styles.wrapper}
      dayClassName={(date) => (hasPlan(date) ? styles.hasPlan : undefined)}
    />
  )
}

const ModeSelect = () => {
  const options = [
    { value: "day", label: "單日" },
    { value: "week", label: "單週" },
    { value: "month", label: "單月" },
  ]

  return (
    <Select
      options={options}
      value={options[1]}
      // onChange={handleChange}
    />
  )
}
