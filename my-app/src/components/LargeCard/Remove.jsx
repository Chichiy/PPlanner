import React from "react"
import { useRouteMatch, useParams, useHistory } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { removeCard_Fs } from "../../firebase/lib"
import { getFloatStyle } from "../../utils/lib"
import { useWindowSize } from "../../utils/customHooks"

const Remove = ({ isFloating, setFloat }) => {
  const { projectId, cardId } = useParams()
  const windowSize = useWindowSize()
  const history = useHistory()
  const match = useRouteMatch()

  const handleRemove = () => {
    removeCard_Fs(projectId, cardId)
    setFloat(false)
    // history.replace({ pathname: match.url.slice(0, -(cardId.length + 1)) })
    history.goBack()
  }

  return (
    <div
      aria-label="remove"
      className={styles.remove_container}
      style={getFloatStyle(isFloating, windowSize)}
    >
      <div aria-label="remove" className={styles.remove_span}>
        此動作將無法復原，確定要將這張卡片刪除嗎？
      </div>
      <div aria-label="remove" className={styles.remove_buttons}>
        <div
          aria-label="remove"
          className={styles.remove_buttons__cancel}
          onClick={() => {
            setFloat(false)
          }}
        >
          取消
        </div>
        <div
          aria-label="remove"
          className={styles.remove_buttons__confirm}
          onClick={handleRemove}
        >
          確定
        </div>
      </div>
    </div>
  )
}

export default Remove
