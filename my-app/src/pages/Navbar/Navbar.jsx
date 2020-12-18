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
import { checkUserStatus } from "../../firebase/Config"

const Navbar = (props) => {
  const user = useSelector((state) => state.user)
  const login = user.id ? true : false
  let { projectId } = useParams()
  let match = useRouteMatch()
  const history = useHistory()
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
              <CardSelect project={project && project} />
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
        <div className={styles.buttons}>
          <div
            className={styles.button}
            onClick={() => {
              setShowing("signIn")
            }}
          >
            登入
          </div>

          <div
            className={styles.colorBtn}
            onClick={() => {
              setShowing("signUp")
            }}
          >
            註冊
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
    // { value: "expenditure", label: "花費板" },
    // { value: "todoList", label: "待辦清單" },
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

const CardSelect = ({ project }) => {
  let history = useHistory()
  let match = useRouteMatch()

  let location = useLocation()
  let { projectId } = useParams()
  const animatedComponents = makeAnimated()

  //prepare options
  const tags = project ? project.tags : []
  const cards = useSelector((state) => state.cards)
  const [options, setOptions] = useState([])

  useEffect(() => {
    //get all added tag's id from each card
    let tagList = cards.reduce(function (prev, curr) {
      curr.tags.forEach((tag) => {
        if (!prev.includes(tag)) {
          prev.push(tag)
        }
      })
      return prev
    }, [])

    try {
      tagList.forEach((tagId, index) => {
        tagList[index] = tags.find((tag) => tag.id === tagId).name
      })
    } catch {
      tagList = []
    }
    const capitalize = (string) => {
      return string.slice(0, 1).toUpperCase() + string.slice(1)
    }

    let temp = []
    tagList.forEach((tag) => {
      temp.push({
        value: tag,
        label: capitalize(tag),
      })
      setOptions(temp)
    })
  }, [cards, tags])

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
        pathname: `${match.url}` + `${match.url.slice(-1) === "/" ? "" : "/"}`,
        search: `?tag=${params.join("+")}`,
        // state: { tags: params },
      }
    } else {
      location = {
        pathname: `${match.url}`,
        // state: { tags: false },
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
  // console.log("dayselect")

  const resetTime = (date) => {
    let temp = new Date(date.getTime())
    temp.setHours(0)
    temp.setMinutes(0)
    temp.setSeconds(0)
    temp.setMilliseconds(0)
    return temp
  }

  const [startDate, setStartDate] = useState(resetTime(new Date()))
  const plannedCards = useSelector((state) => state.cards).filter(
    (card) => card.status === 1
  )
  // let currentDateRange
  // if (plannedCards.length > 0) {
  //   currentDateRange = plannedCards.reduce((prev, curr) => {
  //     try {
  //       let currDate = new Date(curr.start_time)
  //       let diffDay = Math.floor((currDate - startDate) / (24 * 60 * 60 * 1000))
  //       if (diffDay > -1 && diffDay < 7) {
  //         return [...prev, ...currDate]
  //       }
  //     } catch { }
  //   }, [])
  //   console.log(currentDateRange)
  // }

  // useEffect(() => {
  //   if (plannedCards.length > 0) {
  //     // let currentDateRange = plannedCards.reduce(function (prev, curr) {
  //     //   let currDate = new Date(curr.start_time)
  //     //   let diffDay = Math.floor(((currDate - startDate) / 24) * 60 * 60 * 1000)
  //     //   if (diffDay > -1 && diffDay < 7) {
  //     //     return [...prev, ...currDate]
  //     //   }
  //     // }, [])
  //     setStartDate(resetTime(new Date(plannedCards[0].start_time)))
  //   }
  // }, [plannedCards[0]])

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
