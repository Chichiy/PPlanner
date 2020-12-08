import React, { useState, useRef } from "react"
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

import { updateCard_Fs } from "../../../../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

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

            <div className={styles.comments_section}>
              <div className={styles.controll_bar}>
                <div className={styles.title}>留言</div>
              </div>
              <div className={styles.container}>
                {/* comment */}
                <Comment />
                <Comment />
              </div>
            </div>
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
            type="text"
            className={styles.inputDescription}
            value={pending}
            onChange={handleEdit}
            ref={textAreaRef}
            // onBlur={handleEdit}
            // onKeyPress={handleEdit}
          />
        ) : (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </div>
  )
}

const Comment = () => {
  return (
    <div className={styles.comment}>
      <div className={styles.user}>煞</div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.name}>煞氣a工程師</div>
          <div className={styles.time}>30分鐘前</div>
        </div>
        <div className={styles.message}> 超想吃</div>
        <div className={styles.tools}>
          <div className={styles.edit_button}>編輯</div>
          <div className={styles.edit_button}>刪除</div>
        </div>
      </div>
    </div>
  )
}
