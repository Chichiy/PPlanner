import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"

import styles from "./largeCard.module.scss"

import {
  updateCard_Fs,
  listenToComments,
  listenToLinks,
  addComment_Fs,
  updateComment_Fs,
  removeComment_Fs,
  addLink_Fs,
  updateLink_Fs,
  removeLink_Fs,
} from "../../../../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

import Tags, { AddTag } from "./Tags"

//DatesPicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { getTime, getColor, resetTime, colorCode } from "../../../../lib"

const LargeCard = () => {
  const { projectId, cardId } = useParams()
  const card = useSelector((state) =>
    state.cards.find((card) => card.id === cardId)
  )
  const history = useHistory()
  const dispatch = useDispatch()

  //////updates//////
  const updateTitle = (input) => {
    let change = {
      title: input,
    }
    updateCard_Fs(projectId, cardId, change)
  }

  const updateDescription = (input) => {
    let change = {
      description: input,
    }
    updateCard_Fs(projectId, cardId, change)
  }

  //handle close
  const close = (e) => {
    let triggerElementId = ["closeBtn", "largeCardBackground"]

    // close floating menu if onblur
    if (isfloating && e.target.ariaLabel !== isfloating.type) {
      //prevent close on react-datepicker
      if (
        e.target.className.slice(0, 5) === "react" ||
        e.target.getAttribute("aria-labelledBy") === "addTime"
      ) {
        return
      }

      setFloat(false)
      //close card if click on click btn
      if (e.target.id === "closeBtn") {
        history.goBack()
      }
      return
    }

    //close card
    if (triggerElementId.includes(e.target.id)) {
      history.goBack()
      return
    }
  }

  //float menu
  const [isfloating, setFloat] = useState(false)
  const sideBar_addLink = useRef(null)
  const sideBar_addTime = useRef(null)

  const handleFloatMenu = (type, ref) => {
    if (!isfloating) {
      let float = {
        type: type,
        position: ref.current.getBoundingClientRect(),
      }
      setFloat(float)
    } else {
      setFloat(false)
    }
  }

  //links
  const [links, setLinks] = useState([])
  useEffect(() => {
    let unsubscribe = listenToLinks(
      cardId,
      handleAddLink,
      handleModifyLink,
      handleRemoveLink
    )

    return unsubscribe
  }, [])

  const handleAddLink = (res) => {
    if (links.findIndex((link) => link.id === res.id) < 0) {
      setLinks((prev) => [...prev, res])
    }
  }

  const handleModifyLink = (res) => {
    setLinks((prev) =>
      prev.map((link) => {
        return link.id === res.id ? res : link
      })
    )
  }

  const handleRemoveLink = (res, source) => {
    setLinks((prev) => prev.filter((link) => link.id !== res.id))
  }

  try {
    return (
      <div
        id="largeCardBackground"
        className={styles.card_large_background}
        onClick={close}
      >
        <div className={styles.card_large}>
          {/* header */}
          <div className={styles.card_header}>
            <div className={styles.tag_icon}></div>
            <Title title={card.title} handleUpdateTitle={updateTitle} />
            <div id="closeBtn" className={styles.card_close}>
              X
            </div>
          </div>

          {/* main */}
          <div className={styles.card_main}>
            {/* tag section */}
            <Tags
              card={card}
              projectId={projectId}
              isfloating={isfloating}
              setFloat={setFloat}
            />

            {/* discription section */}
            <Description
              description={card.description}
              handleUpdateDescription={updateDescription}
            />
            {links.length > 0 && (
              <Links
                links={links}
                isfloating={isfloating}
                setFloat={setFloat}
              />
            )}

            {/* comments section */}
            <Comments cardId={cardId} projectId={projectId} />
          </div>

          {/* side bar */}
          <div className={styles.card_sideBar}>
            <div className={styles.title}>新增至卡片</div>
            <div className={styles.sidebar_button_todo}>待辦事項</div>
            {card.links ? null : (
              <div
                aria-label="addLink"
                ref={sideBar_addLink}
                className={styles.sidebar_button_addlink}
                onClick={() => {
                  handleFloatMenu("addLink", sideBar_addLink)
                }}
              >
                附件
              </div>
            )}
            <div className={styles.sidebar_button_expenditure}>預估花費</div>
            <div
              aria-label="addTime"
              ref={sideBar_addTime}
              className={styles.sidebar_button_addtime}
              onClick={() => {
                handleFloatMenu("addTime", sideBar_addTime)
              }}
            >
              安排時間
            </div>
          </div>

          {/* float menu */}
          <FloatMenu
            card={card}
            cardId={cardId}
            isfloating={isfloating}
            setFloat={setFloat}
          />
        </div>
      </div>
    )
  } catch {
    return null
  }
}
export default LargeCard

////////////floating menu////////////
const FloatMenu = ({ card, cardId, isfloating, setFloat }) => {
  switch (isfloating.type) {
    case "addLink": {
      return (
        <AddLink isfloating={isfloating} setFloat={setFloat} cardId={cardId} />
      )
    }

    case "addTime": {
      return <AddTime card={card} isfloating={isfloating} setFloat={setFloat} />
    }

    case "addTag": {
      return <AddTag card={card} isfloating={isfloating} setFloat={setFloat} />
    }
    default: {
      return null
    }
  }
}

const AddTime = ({ card, isfloating, setFloat }) => {
  const { projectId, cardId } = useParams()

  //input time holder
  const [startDate, setStartDate] = useState(resetTime(new Date()))
  const [endDate, setEndDate] = useState(resetTime(new Date()))

  useEffect(() => {
    //update time to the latest value
    try {
      if (card.start_time && card.end_time) {
        setStartDate(new Date(card.start_time))
        setEndDate(new Date(card.end_time))
      }
    } catch {}
  }, [])

  const handleAddTime = () => {
    if (
      //check is input valid
      endDate - startDate < 0 ||
      endDate - startDate > 24 * 60 * 60 * 1000 ||
      endDate.getDate() !== startDate.getDate()
    ) {
      alert("日期格式有誤，目前僅接受在同一天開始與結束的時間")
    } else {
      //update to cloud database
      let change = {
        status: 1,
        start_time: startDate,
        end_time: endDate,
      }
      updateCard_Fs(projectId, cardId, change)
    }
  }

  return (
    <div
      aria-label="addTime"
      className={styles.addTime_container}
      style={{
        position: "fixed",
        width: `${isfloating.position.width}px`,
        left: `${isfloating.position.x}px`,
        top: `${isfloating.position.y + 40}px`,
      }}
    >
      <div aria-label="addTime" className={styles.addLink_span}>
        開始時間
      </div>
      <DaySelect date={startDate} setDate={setStartDate} />
      <div aria-label="addTime" className={styles.addLink_span}>
        結束時間
      </div>
      <DaySelect date={endDate} setDate={setEndDate} />
      <div
        aria-label="addTime"
        className={styles.addLink_button}
        onClick={handleAddTime}
      >
        儲存
      </div>
    </div>
  )
}

const DaySelect = ({ date, setDate }) => {
  //show dates with plans
  const plannedCards = useSelector((state) => state.cards).filter(
    (card) => card.status === 1
  )

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
      ariaLabelledBy="addTime"
      selected={date}
      onChange={(date) => setDate(date)}
      className={styles.input}
      showTimeSelect
      dateFormat="Pp"
      popperClassName={styles.popper}
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "-10px, -5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: true,
          boundariesElement: "viewport",
        },
      }}
      wrapperClassName={styles.react_datepicker_wrapper}
      dayClassName={(date) => (hasPlan(date) ? styles.hasPlan : undefined)}
    />
  )
}

const AddLink = ({ isfloating, setFloat, cardId }) => {
  //input link holder
  const [url, setUrl] = useState("")
  // const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    // setLoading(true)
    setFloat(false)
    const cors = "https://cors-anywhere.herokuapp.com/"
    // const url = "https://andy6804tw.github.io/2019/09/21/fix-cors-problem/"

    const res = await fetch(cors + url)
    const data = await res.text()

    var parser = new DOMParser()
    var doc = parser.parseFromString(data, "text/html")
    let title = doc.querySelector("title").textContent
    let img = doc.querySelector("body").querySelector("img")

    //// img converter ////
    // get src
    img = img ? img.src : ""

    //update domain if using relative path
    let myOrigin = window.location.origin
    if (img.slice(0, myOrigin.length) === myOrigin) {
      let correctOrigin = new URL(url).origin
      let correctImgPath = correctOrigin + img.slice(origin.length)
      img = correctImgPath
    }

    let pending = {
      card_id: cardId,
      url: url,
      title: title,
      img: img,
      date: new Date(),
    }

    ///update fiebase
    addLink_Fs(pending)
    // setLoading(false)
    setUrl("")
  }

  return (
    <div
      aria-label="addLink"
      className={styles.addLink_container}
      style={{
        position: "fixed",
        left: `${isfloating.position.x}px`,
        top: `${isfloating.position.y + 40}px`,
      }}
    >
      <div aria-label="addLink" className={styles.addLink_span}>
        附加連結
      </div>
      <input
        aria-label="addLink"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="請貼上連結"
        className={styles.addLink_input}
        autoFocus
      />
      <div
        aria-label="addLink"
        className={styles.addLink_button}
        onClick={url ? handleSubmit : null}
      >
        附加
      </div>
    </div>
  )
}

////////////Title////////////

const Title = ({ title, handleUpdateTitle }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(title)

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleUpdateTitle(e.target.value)
      } else {
        alert("請輸入卡片標題")
      }
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        className={styles.inputTitle}
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
        autoFocus
      />
    )
  } else {
    return (
      <div
        id="largeCardTitle"
        className={styles.card_title}
        onClick={() => setEditing(!isEditing)}
      >
        {title}
      </div>
    )
  }
}

////////////Description////////////

const Description = ({ description, handleUpdateDescription }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(description)

  const handleSave = (e) => {
    handleUpdateDescription(pending ? pending : "")
    setEditing(!isEditing)
  }

  const textAreaRef = useRef(0)
  const handleEdit = (e) => {
    try {
      // console.log(e)
      setPending(e.target.value)

      //auto-grow textarea
      let height = parseInt(getComputedStyle(e.target).height.slice(0, -2))
      let lineHeight = parseInt(
        getComputedStyle(e.target).lineHeight.slice(0, -2)
      )
      let padding = parseInt(getComputedStyle(e.target).padding.slice(0, -2))

      if (e.target.scrollHeight > height) {
        textAreaRef.current.style.height = `${
          e.target.scrollHeight + padding * 2
        }px`
      } else {
        while (height >= e.target.scrollHeight && e.target.scrollHeight >= 54) {
          textAreaRef.current.style.height = `${height - lineHeight}px`
          height -= lineHeight
        }
        textAreaRef.current.style.height = `${height + lineHeight}px`
      }
    } catch {
      console.error()
    }
  }

  return (
    <div className={styles.description_section}>
      <div className={styles.controll_bar}>
        <div className={styles.title}>描述</div>

        {/* edit/save btn */}
        {isEditing ? (
          <div className={styles.save_button} onClick={handleSave}>
            儲存
          </div>
        ) : (
          <div
            className={styles.edit_button}
            onClick={() => setEditing(!isEditing)}
          >
            編輯
          </div>
        )}
      </div>

      <div className={styles.container}>
        {/* textarea/display section */}
        {isEditing ? (
          <textarea
            ref={textAreaRef}
            type="text"
            className={styles.inputDescription}
            value={pending}
            onChange={handleEdit}
            // onFocus={handleEdit}
            onBlur={handleSave}
            autoFocus
            // onBlur={handleEdit}
            // onKeyPress={handleEdit}
          />
        ) : (
          <pre className={styles.description}>{description}</pre>
        )}
      </div>
    </div>
  )
}

////////////Links////////////

const Links = ({ links, isfloating, setFloat }) => {
  const toggleAddLinkBtnRef = useRef(1)

  const toggleAddLinkBtn = (e) => {
    if (isfloating.type === "addLink") {
      setFloat(false)
    } else {
      let float = {
        type: "addLink",
        position: toggleAddLinkBtnRef.current.getBoundingClientRect(),
      }

      setFloat(float)
    }
  }

  return (
    <div className={styles.link_section}>
      <div className={styles.title}>附件</div>
      <div className={styles.container}>
        {/* {loading && <h3>Fetching link previews... 🤔🤔🤔</h3>} */}
        {links.map((data) => (
          <LinkItem key={data.url} data={data} />
        ))}

        <div
          className={styles.toggleAddLinkBtn}
          onClick={toggleAddLinkBtn}
          ref={toggleAddLinkBtnRef}
        >
          增加附件
        </div>
        {/* {isfloating.type === "addLink" && (
          <AddLink
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            isfloating={isfloating}
          />
        )} */}
      </div>
      {/* textarea/display section */}
      {/* {isEditing ? (
          <textarea
            ref={textAreaRef}
            type="text"
            className={styles.inputDescription}
            value={pending}
            onChange={handleEdit}
            // onFocus={handleEdit}
            onBlur={handleSave}
            autoFocus
            // onBlur={handleEdit}
            // onKeyPress={handleEdit}
          />
        ) : (
          <pre className={styles.description}>{description}</pre>
        )}
      </div> */}
    </div>
  )
}

const LinkItem = ({ data }) => {
  const title = useRef(0)

  const getTitle = () => {
    //slice the title more precisely, but only works when re-render
    // if (title.current.scrollHeight > title.current.clientHeight) {
    //   while (title.current.scrollHeight > title.current.clientHeight) {
    //     title.current.textContent = title.current.textContent.slice(0, -1)
    //   }
    //   title.current.textContent = title.current.textContent.slice(0, -3) + "..."
    //   return title.current.textContent
    // }

    // for the first render, slice with rough length
    if (data.title.length > 43) {
      return data.title.slice(0, 43) + "..."
    } else {
      return data.title
    }
  }

  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(data.title)

  const handleEditTitle = (e) => {
    if ((e.target.ariaLabel = "editBtn")) {
      if (isEditing && data.title !== pending) {
        updateLink(pending)
        setEditing(!isEditing)
      } else {
        setEditing(!isEditing)
      }
    }
  }

  const updateLink = (input) => {
    let change = {
      title: input,
    }
    updateLink_Fs(data.id, change)
  }

  const removeLink = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這個附件嗎？")

      if (yes) {
        removeLink_Fs(data.id)
      }
    }
  }

  return (
    <div className={styles.link_container}>
      <a
        className={styles.preview_img}
        href={data.url}
        target="_blank"
        rel="noreferrer"
      >
        <img src={data.img} alt="link's thumbnail" />
      </a>
      <div className={styles.info}>
        {isEditing ? (
          <textarea
            className={styles.message}
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            autoFocus
          />
        ) : (
          <a
            className={styles.title}
            ref={title}
            href={data.url}
            target="_blank"
            rel="noreferrer"
          >
            {getTitle()}
          </a>
        )}

        <div className={styles.tools}>
          <div className={styles.time}>{getTime(data.date)}</div>
          <div
            aria-label="removeBtn"
            className={styles.edit_button}
            onClick={removeLink}
          >
            移除
          </div>
          <div
            aria-label="editBtn"
            className={styles.edit_button}
            onClick={handleEditTitle}
          >
            編輯
          </div>
        </div>
      </div>
    </div>
  )
}

//////Comments//////

const Comments = ({ cardId, projectId }) => {
  const userId = useSelector((state) => state.user.id)
  const [comments, setComments] = useState([])
  //get data from cloud
  useEffect(() => {
    let unsubscribe = listenToComments(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )

    return unsubscribe
  }, [])

  const handleAdd = (res, source) => {
    //prevent repeatly adding when itinitallizing
    if (comments.findIndex((comment) => comment.id === res.id) < 0) {
      setComments((prev) => [...prev, res])
    }
  }

  const handleModify = (res) => {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === res.id ? res : comment
      })
    )
  }

  const handleRemove = (res, source) => {
    setComments((prev) => prev.filter((comment) => comment.id !== res.id))
  }

  return (
    <div className={styles.comments_section}>
      <div className={styles.controll_bar}>
        <div className={styles.title}>留言</div>
      </div>
      <div className={styles.container}>
        {/* comment */}
        <AddComment cardId={cardId} userId={userId} />
        {comments.map((comment) => {
          return <Comment key={nanoid()} comment={comment} userId={userId} />
        })}
      </div>
    </div>
  )
}

const AddComment = ({ cardId, userId }) => {
  const userName = useSelector((state) => state.user.name)
  const [pending, setPending] = useState("")

  const addComment = (e) => {
    if (e.key === "Enter" && pending !== "") {
      let input = {
        card_id: cardId,
        sender_id: userId,
        content: pending,
        date: new Date(),
      }
      //update cloud data
      addComment_Fs(input)
      setPending("")
    }
  }

  const getColor = () => {
    let code = Math.floor(userId.charCodeAt(0) * 4.86 - 233.28)
    let colorCode = `hsl(${code},95%, 75%)`
    return colorCode
  }

  return (
    <div className={styles.comment}>
      <div
        className={styles.user}
        style={{
          marginTop: "12px",
          backgroundColor: getColor(),
        }}
      >
        {userName[0]}
      </div>
      <div className={styles.details}>
        <input
          className={styles.message}
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          placeholder="撰寫留言"
          onKeyPress={addComment}
        />
      </div>
    </div>
  )
}

const Comment = ({ comment, userId }) => {
  const isMyComment = userId === comment.sender_id

  //edit comment
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(comment.content)
  const handleEditComment = (e) => {
    if ((e.target.ariaLabel = "editBtn")) {
      if (isEditing) {
        updateComment(pending)
        setEditing(!isEditing)
      } else {
        setEditing(!isEditing)
      }
    }
  }

  const updateComment = (input) => {
    let change = {
      content: input,
    }
    updateComment_Fs(comment.id, change)
  }

  const removeComment = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這則留言嗎？")

      if (yes) {
        removeComment_Fs(comment.id)
      }
    }
  }

  const sender = useSelector((state) =>
    state.members.find((member) => member.id === comment.sender_id)
  )

  try {
    return (
      <div className={styles.comment}>
        <div
          className={styles.user}
          style={{ backgroundColor: getColor(sender.id) }}
        >
          {sender.name[0]}
        </div>
        <div className={styles.details}>
          <div className={styles.info}>
            <div className={styles.name}>{sender.name}</div>
            {/* <time>{comment.time}</time> */}
            <div className={styles.time}>{getTime(comment.date)}</div>
          </div>

          {isEditing ? (
            <textarea
              className={styles.message}
              value={pending}
              onChange={(e) => setPending(e.target.value)}
              autoFocus
            />
          ) : (
            <pre className={styles.message}>{comment.content} </pre>
          )}

          {isMyComment ? (
            <div className={styles.tools}>
              <div
                aria-label="editBtn"
                className={styles.edit_button}
                onClick={handleEditComment}
              >
                編輯
              </div>
              <div
                aria-label="removeBtn"
                className={styles.edit_button}
                onClick={removeComment}
              >
                刪除
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  } catch {
    return null
  }
}
