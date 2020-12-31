import React, { useState, useRef } from "react"
import styles from "./LargeCard.module.scss"

const Description = ({ description, handleUpdateDescription }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(description)

  const handleSave = (e) => {
    handleUpdateDescription(pending ? pending : "")

    setEditing(false)
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
        {!isEditing && (
          <div
            className={styles.edit_button}
            onClick={(e) => {
              console.log(e)
              setEditing(!isEditing)
            }}
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
            className={styles.inputDescription}
            type="text"
            placeholder="在這裡新增描述..."
            value={pending}
            onChange={handleEdit}
            onBlurCapture={handleSave}
            autoFocus
          />
        ) : (
          <pre
            className={styles.description}
            style={!description ? { color: "gray" } : null}
            onClick={() => setEditing(!isEditing)}
          >
            {description ? description : "在這裡新增描述..."}
          </pre>
        )}

        {isEditing && (
          <div className={styles.save_button} aria-label="saveButton">
            儲存
          </div>
        )}
      </div>
    </div>
  )
}

export default Description
