import React, { useState, useEffect, useRef } from "react"

import styles from "./CardBoard.module.scss"
import { colorCode, categoryTitle } from "../../utils/lib"
import DayJS from "react-dayjs"

import { listenToLinks, listenToComments } from "../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

// const fakeImg = "https://fakeimg.pl/65x65/"

export const SmallCard = ({ card, project }) => {
  return (
    <div id={card.id} className={styles.card_small}>
      <div
        className={styles.tag}
        style={{ backgroundColor: colorCode[card.category] }}
      ></div>
      <div className={styles.info}>
        {/* <div className={styles.card_small_picture}>
          <img src={card.cover_pic} alt="pic" />
        </div> */}
        <div className={styles.details}>
          <div className={styles.title}>{card.title}</div>
          <div className={styles.description}>{card.description}</div>
        </div>
        <div className={styles.small_card_icons}>
          {/* show card's status  */}
          {card.start_time && (
            <div className={styles.small_card_icon__status}>
              <DayJS format="MM/DD">{card.start_time}</DayJS>
            </div>
          )}

          {/* show card's link number  */}

          <LinkIcon cardId={card.id} />

          {/* show card's comment number  */}
          <CommentIcon cardId={card.id} />

          {/* fill empty  */}
          <div className={styles.space}></div>

          {/* show card's tags  */}
          {card.tags.length > 0 &&
            card.tags.map((tag) => {
              try {
                let target = project.tags.find((item) => item.id === tag)
                return (
                  <div
                    key={nanoid()}
                    style={{ backgroundColor: colorCode[target.color] }}
                    className={styles.small_card_icon__tag}
                  ></div>
                )
              } catch {
                return null
              }
            })}
        </div>
      </div>
    </div>
  )
}

const CommentIcon = ({ cardId }) => {
  const commentsNumber = useRef(0)

  useEffect(() => {
    const handleAdd = () => {
      commentsNumber.current += 1
    }

    const handleModify = () => {
      //do nothing
    }
    const handleRemove = () => {
      commentsNumber.current -= 1
    }

    //listen to links number and handle counts
    const unsubscribe = listenToComments(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )
    return unsubscribe
  }, [])

  return commentsNumber.current > 0 ? (
    <div className={styles.small_card_icon__comment}>
      {commentsNumber.current}
    </div>
  ) : null
}

const LinkIcon = ({ cardId }) => {
  const linksNumber = useRef(0)

  useEffect(() => {
    const handleAdd = () => {
      linksNumber.current += 1
    }
    const handleModify = () => {
      //do nothing
    }
    const handleRemove = () => {
      linksNumber.current -= 1
    }

    //listen to links number and handle counts
    const unsubscribe = listenToLinks(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )
    return unsubscribe
  }, [])

  return linksNumber.current > 0 ? (
    <div className={styles.small_card_icon__link}>{linksNumber.current}</div>
  ) : null
}

export const AddCard = ({ pendingInfo, setPendingInfo, shouldAddCard }) => {
  //category related
  const [selectCategory, setCategory] = useState(false)
  const toggleCategorySelect = (e) => {
    if (e.target.id === "pendingCategory") {
      setCategory(!selectCategory)
    }
  }
  const updateCategory = (e) => {
    setPendingInfo({
      ...pendingInfo,
      category: e.target.value,
    })
    setCategory(!selectCategory)
  }

  const updateTitle = (input) => {
    setPendingInfo({ ...pendingInfo, title: input })
  }

  const updateDescription = (input) => {
    setPendingInfo({ ...pendingInfo, description: input })
  }

  return (
    <div className={styles.card_small}>
      <div
        id="pendingCategory"
        className={styles.tag}
        style={{ backgroundColor: colorCode[pendingInfo.category] }}
        onClick={toggleCategorySelect}
      >
        {selectCategory ? (
          <SelectCategory
            handleSelectCategory={updateCategory}
            selected={pendingInfo.category}
          />
        ) : null}
      </div>

      <div className={styles.info}>
        {/* <div className={styles.card_small_picture}>
          <img src={fakeImg} alt="pic" />
        </div> */}
        <div className={styles.details}>
          <PendingTitle
            pendingTitle={pendingInfo.title}
            handleTitleUpdate={updateTitle}
          />

          <PendingDescription
            pendingDescription={pendingInfo.description}
            handleDescriptionUpdate={updateDescription}
          />
        </div>
      </div>
    </div>
  )
}

////////////Title////////////

const PendingTitle = (props) => {
  const [isEditing, setEditing] = useState(true)
  const [pending, setPending] = useState("")

  let { pendingTitle, handleTitleUpdate } = props

  const toggleInputTitle = (e) => {
    if (e.target.id === "pendingTitle") {
      setEditing(!isEditing)
    }
  }

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleTitleUpdate(e.target.value)
      } else {
        handleTitleUpdate("")
      }
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        className={styles.inputTitle}
        placeholder="請輸入標題"
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
        id="pendingTitle"
        className={styles.title}
        onClick={toggleInputTitle}
      >
        {pendingTitle}
      </div>
    )
  }
}

////////////Description////////////

const PendingDescription = (props) => {
  const [isEditing, setEditing] = useState(true)
  const [pending, setPending] = useState("")

  let { pendingDescription, handleDescriptionUpdate } = props

  const toggleInputDescription = (e) => {
    if (e.target.id === "pendingDescription") {
      setEditing(!isEditing)
    }
  }

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleDescriptionUpdate(e.target.value)
      } else {
        handleDescriptionUpdate("")
      }
    }
  }

  if (isEditing) {
    return (
      <textarea
        type="text"
        className={styles.inputDescription}
        placeholder="對卡片增加描述"
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
      />
    )
  } else {
    return (
      <div
        id="pendingDescription"
        className={styles.description}
        onClick={toggleInputDescription}
      >
        {pendingDescription}
      </div>
    )
  }
}

////////////Category////////////

const SelectCategory = ({ selected, handleSelectCategory }) => {
  const categories = ["hotel", "activity", "site", "food", "commute", "default"]

  return (
    <div className={styles.selectCategory}>
      {categories.map((category) => {
        return (
          <option
            key={nanoid()}
            value={category}
            style={{
              backgroundColor: colorCode[category],
            }}
            className={
              selected === category
                ? `${styles.option} ${styles.current}`
                : styles.option
            }
            onClick={handleSelectCategory}
          >
            {categoryTitle(category)}
          </option>
        )
      })}
    </div>
  )
}
