import React, { useState, useEffect } from "react"

import styles from "../cardBoard.module.scss"

const fakeImg = "https://fakeimg.pl/65x65/"

export const SmallCard = (props) => {
  let card = props.card

  return (
    <div className={styles.card_small}>
      <div className={styles[`tag_${card.category}`]}></div>
      <div className={styles.info}>
        <div className={styles.card_small_picture}>
          <img src={card.cover_pic} alt="pic" />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>{card.title}</div>
          <div className={styles.description}>{card.description}</div>
        </div>
      </div>
    </div>
  )
}

export const AddCard = ({ pendingInfo, setPendingInfo, shouldAddCard }) => {
  //new card data
  // const emptyCard = {
  //   title: "",
  //   description: "",
  //   category: "default",
  // }

  // const [pendingInfo, setPendingInfo] = useState(emptyCard)

  // useEffect(() => {
  //   return () => {
  //     console.log("unmount")
  //   }
  // })

  // console.log(pendingInfo !== emptyCard)
  // pendingInfo, setPendingInfo, shouldAddCard
  //detemine should add card or not
  // if (pendingInfo !== emptyCard) {
  //   shouldAddCard(true)
  // }

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
      tags: [e.target.value],
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
        className={styles[`tag_${pendingInfo.category}`]}
        onClick={toggleCategorySelect}
      >
        {selectCategory ? (
          <SelectCategory handleSelectCategory={updateCategory} />
        ) : null}
      </div>

      <div className={styles.info}>
        <div className={styles.card_small_picture}>
          <img src={fakeImg} alt="pic" />
        </div>
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
        placeholder="編輯標題"
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
        placeholder="編輯描述"
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

const SelectCategory = (props) => {
  const categories = ["food", "hotel", "country", "site", "commute", "default"]
  let handleSelectCategory = props.handleSelectCategory

  return (
    <div className={styles.selectCategory}>
      {categories.map((category) => {
        return (
          <option
            value={category}
            className={styles[`category_${category}`]}
            onClick={handleSelectCategory}
          >
            {category}
          </option>
        )
      })}
    </div>
  )
}
