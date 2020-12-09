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
  addComment_Fs,
  updateComment_Fs,
  removeComment_Fs,
} from "../../../../../firebase/Config"
import { current, nanoid } from "@reduxjs/toolkit"

const LargeCard = ({ CloseCard }) => {
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

  //close large card
  const closeCard = (e) => {
    let triggerElementId = ["closeBtn", "largeCardBackground"]

    if (triggerElementId.includes(e.target.id)) {
      history.goBack()
    }
  }

  try {
    return (
      <div
        id="largeCardBackground"
        className={styles.card_large_background}
        onClick={closeCard}
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

          <div className={styles.card_main}>
            {/* tag section */}

            <div className={styles.tags_section}>
              <div className={styles.title}>標籤</div>
              <div className={styles.container}>
                {card.tags.map((tag) => {
                  return (
                    <div key={nanoid()} className={styles[`tag_${tag}`]}>
                      {tag}
                    </div>
                  )
                })}

                <div className={styles.new_tag}>+</div>
              </div>
            </div>

            {/* discription section */}

            <Description
              description={card.description}
              handleUpdateDescription={updateDescription}
            />

            {/* comments section */}

            <Comments cardId={cardId} projectId={projectId} />
          </div>
          <div className={styles.card_sideBar}>
            <div className={styles.title}>新增至卡片</div>
            <div className={styles.button}>待辦事項</div>
            <div className={styles.button}>附件</div>
            <div className={styles.button}>預估花費</div>
            <div className={styles.button}>預估時長</div>
          </div>
        </div>
      </div>
    )
  } catch {
    return null
  }
}
export default LargeCard

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
      console.log("fire")
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
          return (
            <Comment
              key={nanoid()}
              comment={comment}
              userId={userId}
              // handleEditComment={editComment}
              // handleRemoveComment={removeComment}
            />
          )
        })}
      </div>
    </div>
  )
}

const AddComment = ({ cardId, userId }) => {
  // const [isEditing, setEditing] = useState(false)
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

  return (
    <div className={styles.comment}>
      <div className={styles.user}>煞</div>
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

const Comment = ({
  comment,
  userId,
  // handleEditComment,
  // handleRemoveComment,
}) => {
  const isMyComment = userId === comment.sender_id

  //calculate comment time
  let getTime = () => {
    let commentedTime = new Date(comment.date).getTime()
    let currentTime = new Date().getTime()

    //to second
    let interval = Math.floor((currentTime - commentedTime) / 1000)

    if (interval < 5) {
      return `目前`
    }

    if (interval < 60) {
      return `${interval}秒前`
    }

    //to minute
    interval = Math.floor(interval / 60)

    if (interval < 60) {
      return `${interval}分鐘前`
    }

    //to hour
    interval = Math.floor(interval / 60)
    if (interval < 24) {
      return `${interval}小時前`
    }

    //to day
    interval = Math.floor(interval / 24)
    if (interval < 30) {
      return `${interval}天前`
    }

    //to month
    interval = Math.floor(interval / 30)
    if (interval < 12) {
      return `${interval}月前`
    }

    //to year
    interval = Math.floor(interval / 12)
    return `${interval}年前`
  }

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

  return (
    <div className={styles.comment}>
      <div className={styles.user}>{comment.sender_id.slice(0, 1)}</div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.name}>{comment.sender_id}</div>
          {/* <time>{comment.time}</time> */}
          <div className={styles.time}>{getTime()}</div>
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
}
