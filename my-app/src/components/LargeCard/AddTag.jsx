import React, { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { updateCard_Fs, updateProject_Fs } from "../../firebase/Config"
import { colorCode, deepCopy } from "../../utils/lib"

const AddTag = ({ card, isfloating }) => {
  const { projectId, cardId } = useParams()
  const tags = useSelector(
    (state) => state.projects.find((project) => project.id === projectId).tags
  )
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState("")
  const inputRef = useRef(null)

  const toggleTag = (tagId) => {
    const index = card.tags.findIndex((tag) => tag === tagId)
    const shouldAddTag = index < 0
    const change = {
      tags: Array.from(card.tags),
    }
    shouldAddTag ? change.tags.push(tagId) : change.tags.splice(index, 1)
    updateCard_Fs(projectId, cardId, change)
  }

  const startEdit = (tagId, tagName) => {
    setPending(tagName)
    setEditing(tagId)
    inputRef.current?.focus() // enable autofocus when switch input between tags
  }

  const saveTagName = () => {
    const shouldSave = tags.find((tag) => tag.id === isEditing).name !== pending

    if (shouldSave) {
      const change = {
        tags: deepCopy(tags),
      }
      change.tags.forEach((tag) => {
        if (tag.id === isEditing) tag.name = pending
      })
      updateProject_Fs(projectId, change)
    }

    setEditing(false) // close input no matter should save or not
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      // press on ESC
      setEditing(false)
    }
    if (e.keyCode === 13) {
      // press on Enter
      saveTagName()
    }
  }

  return (
    <div
      style={{
        top: `${isfloating.position.y + 32}px`,
        left: `${isfloating.position.x}px`,
      }}
      className={styles.addTag_container}
      aria-label="addTag"
    >
      {!isEditing ? (
        <span aria-label="addTag" className={styles.addTag_span}>
          標籤
        </span>
      ) : (
        <input
          ref={inputRef}
          aria-label="addTag"
          type="text"
          value={pending}
          onChange={(e) => {
            setPending(e.target.value)
          }}
          onBlur={saveTagName}
          onKeyDown={handleKeyDown}
          placeholder="請輸入標籤標題..."
          className={styles.input}
          autoFocus
        />
      )}

      {tags.map((tag) => {
        return (
          <div key={tag.id} className={styles.tag_container}>
            <div
              aria-label="addTag"
              className={
                `${card.tags.includes(tag.id) ? styles.active : styles.tag}` +
                ` ${isEditing === tag.id ? styles.editing : ""}`
              }
              style={{ backgroundColor: colorCode[tag.color] }}
              onClick={() => {
                toggleTag(tag.id)
              }}
            >
              {tag.name}
            </div>
            <div
              aria-label="addTag"
              className={isEditing === tag.id ? styles.onEdit : styles.edit}
              onClick={() => {
                startEdit(tag.id, tag.name)
              }}
            ></div>
          </div>
        )
      })}
    </div>
  )
}

export default AddTag
