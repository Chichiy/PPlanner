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

//DatePicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import styles from "./navbar.module.scss"
import User from "../User/User"
import Title from "./component/Title"
import { getColor } from "../lib"

const Navbar = (props) => {
  //get login status
  const user = useSelector((state) => state.user)
  const login = user.id ? true : false

  //get project data
  const { projectId } = useParams()
  const thisProject = (state) =>
    state.projects.find((project) => project.id === projectId)
  const project = useSelector(thisProject)

  //get different feature bar
  const renderSwitch = () => {
    switch (props.type) {
      case "cards": {
        return (
          <div className={styles.board_bar}>
            <div className={styles.board_select}>
              <BoardSelect type={props.type} />
            </div>

            <div className={styles.card_select}>
              <CardSelect project={project && project} />
            </div>
            <Invitation isShowing={isShowing} setShowing={setShowing} />
          </div>
        )
      }
      case "itineraries": {
        return (
          <div className={styles.board_bar}>
            <div className={styles.board_select}>
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
          <div className={styles.board_bar}>
            <div className={styles.board_select}>
              <BoardSelect type={props.type} />
            </div>
          </div>
        )
      }
      case "todoList": {
        return (
          <div className={styles.board_bar}>
            <div className={styles.board_select}>
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

  //show popup
  const location = useLocation()
  const [isShowing, setShowing] = useState(false)

  //handle poppu request from other conponent
  useEffect(() => {
    try {
      if (location.state.showPopup) {
        setShowing(location.state.showPopup)
      }
    } catch {}
  }, [location])

  const clickOnUserIcon = () => {
    if (isShowing !== "user") {
      setShowing("user")
    }
    if (isShowing === "user") {
      setShowing(false)
    }
  }

  return (
    <div className={styles.navbar}>
      <Switch>
        {/* display: home button and project title on project page*/}
        <Route path={`/projects/${projectId}`}>
          <Link
            to="/projects"
            className={`${styles.item} ${styles.home} ${styles.tooltip}`}
          >
            <div className={styles.tooltip_text}>返回總覽</div>
          </Link>
          <Title
            title={project ? project.title : null}
            projectId={project ? project.id : null}
          />
        </Route>

        {/* display: logo on index and projects page*/}
        <Route path="/">
          <Link to="/projects" className={styles.logo}></Link>
        </Route>
      </Switch>

      {/* display: feature bar */}
      {renderSwitch()}

      {/* display: to fill the empty space */}
      <div className={styles.space}></div>

      {/* display: user status */}

      {login ? (
        <div
          className={styles.user_icon}
          onClick={clickOnUserIcon}
          style={{ backgroundColor: getColor(user.id) }}
        >
          {user.name[0]}
        </div>
      ) : (
        <div className={styles.user_buttons}>
          <div
            className={styles.sign_in_button}
            onClick={() => {
              setShowing("signIn")
            }}
          >
            登入
          </div>

          <div
            className={styles.sign_up_button}
            onClick={() => {
              setShowing("signUp")
            }}
          >
            註冊
          </div>
        </div>
      )}

      {isShowing && <User isShowing={isShowing} setShowing={setShowing} />}
    </div>
  )
}

export default Navbar

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 30,
  }),
  input: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 5,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 5,
    height: 30,
    boxSizing: "border-box",
  }),

  singleValue: (provided) => ({
    ...provided,
    fontSize: 16,
  }),
}

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
      styles={customStyles}
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
      styles={customStyles}
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

const Invitation = ({ isShowing, setShowing }) => {
  // const [isShowing, setShow] = useState(false)
  const { projectId } = useParams()

  const getUrl = () => {
    let url = window.location.origin
    return url + `/joinProject/${projectId}`
  }
  const handleFocus = (e) => {
    e.target.select()
  }

  const handleCopy = () => {
    let copyText = document.querySelector("#url")
    copyText.select()
    copyText.setSelectionRange(0, 99999) /* For mobile devices */
    document.execCommand("copy")
    setShowing(false)
  }

  const clickOnInvitation = (e) => {
    if (isShowing !== "invitation") {
      setShowing("invitation")
    } else if (e.target.id === "invitation") {
      setShowing(false)
    }
  }

  return (
    <div
      id="invitation"
      className={styles.invitation}
      onClick={clickOnInvitation}
    >
      邀請
      {isShowing === "invitation" && (
        // <div>
        <div className={styles.invitation_container}>
          <div className={styles.caption}>邀請好友加入</div>
          <input
            id="url"
            className={styles.url}
            type="text"
            value={getUrl()}
            autoFocus
            readOnly
            onFocus={handleFocus}
          />
          <div className={styles.buttons}>
            <div className={styles.copy_button} onClick={handleCopy}>
              點擊複製連結
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
