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
  updateProject_Fs,
} from "../../../../../firebase/Config"
import { nanoid } from "@reduxjs/toolkit"

//DatesPicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import {
  getTime,
  getColor,
  resetTime,
  colorCode,
  colorCode_tags,
} from "../../../../lib"

const Tags = ({ projectId, card, isfloating, setFloat }) => {
  const project = useSelector((state) =>
    state.projects.find((project) => project.id === projectId)
  )

  const toggleAddTag = (e) => {
    let float = {
      type: "addTag",
      position: e.target.getBoundingClientRect(),
    }

    setFloat(float)
  }
  try {
    return (
      <div className={styles.tags_section}>
        <div className={styles.title}>標籤</div>
        <div className={styles.container}>
          {/* category tag */}
          <div
            aria-label="addTag" //need to be able to change category
            className={styles.tag}
            style={{ backgroundColor: colorCode[card.category] }}
            onClick={toggleAddTag}
          >
            {card.category}
          </div>

          {/* regular tags */}
          {card.tags.map((tag) => {
            let target = project.tags.find((item) => item.id === tag)

            return (
              <div
                aria-label="addTag"
                key={nanoid()}
                className={styles.tag}
                style={{
                  backgroundColor: colorCode[target.color],
                }}
                onClick={toggleAddTag}
              >
                {target.name}
              </div>
            )
          })}
          <div
            aria-label="addTag"
            className={styles.tag}
            onClick={toggleAddTag}
          >
            +
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.log(err.message)
    return null
  }
}

export default Tags

export const AddTag = ({ card, isfloating, setFloat }) => {
  const { projectId, cardId } = useParams()

  const tags = useSelector(
    (state) => state.projects.find((project) => project.id === projectId).tags
  )

  const toggleTag = (e) => {
    let index = card.tags.findIndex((tag) => tag === e.target.dataset.tagid)
    let newTags
    if (index > -1) {
      //delete if tag exists
      newTags = Array.from(card.tags)
      newTags.splice(index, 1)

      let change = {
        tags: newTags,
      }
      updateCard_Fs(projectId, cardId, change)
    } else {
      //add if not exists
      newTags = Array.from(card.tags)
      newTags.push(e.target.dataset.tagid)

      let change = {
        tags: newTags,
      }
      updateCard_Fs(projectId, cardId, change)
    }
  }

  const [isEditing, setEditing] = useState(false)
  const [onChangeTagId, setChangingTag] = useState(null)
  const [pending, setPending] = useState("")

  const handleEditTag = (tagId, tagName) => {
    if (isEditing) {
      setPending(tagName)
      setChangingTag(tagId)
    } else {
      setPending(tagName)
      setChangingTag(tagId)
      setEditing(true)
    }
  }

  const saveEditTag = () => {
    if (
      isEditing &&
      tags.find((tag) => tag.id === onChangeTagId).name !== pending
    ) {
      let newTags = []
      tags.forEach((tag) => {
        let temp = {}
        for (let key in tag) {
          temp[key] = tag[key]
        }
        newTags.push(temp)
      })
      newTags.find((tag) => tag.id === onChangeTagId).name = pending

      let change = {
        tags: newTags,
      }

      updateProject_Fs(projectId, change)
      setPending("")
      setChangingTag(null)
      setEditing(false)
    }
  }

  try {
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
            aria-label="addTag"
            type="text"
            value={pending}
            onChange={(e) => {
              setPending(e.target.value)
            }}
            placeholder="請輸入標籤標題..."
            className={styles.input}
            autoFocus
          />
        )}

        {tags.map((tag, index) => {
          return (
            <div className={styles.tag_container}>
              <div
                aria-label="addTag"
                data-tagId={tag.id}
                className={
                  ` ${styles.tag}` +
                  `  ${card.tags.includes(tag.id) && styles.active}` +
                  `  ${onChangeTagId === tag.id && styles.editing}`
                }
                style={{ backgroundColor: colorCode[tag.color] }}
                onClick={toggleTag}
              >
                {tag.name}
              </div>
              <div
                aria-label="addTag"
                data-tagId={tag.id}
                className={
                  onChangeTagId === tag.id ? styles.onEdit : styles.edit
                }
                onClick={() => {
                  handleEditTag(tag.id, tag.name)
                }}
              ></div>
            </div>
          )
        })}
        <div
          aria-label="addTag"
          className={styles.addTag_button}
          onClick={() => {
            saveEditTag()
          }}
        >
          新增
        </div>
      </div>
    )
  } catch {
    return null
  }
}
