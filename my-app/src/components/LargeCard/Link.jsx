import React, { useState, useRef } from "react"

import styles from "./LargeCard.module.scss"

import { FS } from "../../firebase/lib"

import { getDiffTime } from "../../utils/lib"

const Link = ({ data }) => {
  const title = useRef(0)

  const getTitle = () => {
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
    FS.links.update(data.id, change)
  }

  const removeLink = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這個附件嗎？")

      if (yes) {
        FS.links.remove(data.id)
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
        {data.img ? <img src={data.img} alt="Link" /> : "Link"}
      </a>
      <div className={styles.link_info}>
        {isEditing ? (
          <textarea
            className={styles.message}
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            autoFocus
          />
        ) : (
          <a
            className={styles.link_info__title}
            ref={title}
            href={data.url}
            target="_blank"
            rel="noreferrer"
          >
            {getTitle()}
          </a>
        )}

        <div className={styles.tools}>
          <div className={styles.time}>{getDiffTime(data.date)}</div>
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

export default Link
