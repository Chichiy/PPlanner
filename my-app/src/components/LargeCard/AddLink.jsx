import { useState } from "react"
import styles from "./LargeCard.module.scss"
import { addLink_Fs } from "../../firebase/lib"
import { getFloatStyle, getLinkInfo } from "../../utils/lib"
import { useWindowSize } from "../../utils/customHooks"

const AddLink = ({ isFloating, setFloat, cardId }) => {
  const windowSize = useWindowSize()
  const [url, setUrl] = useState("")

  const handleSubmit = async () => {
    setFloat(false)
    const link = await getLinkInfo(url)

    addLink_Fs({
      card_id: cardId,
      url: url,
      title: link.title,
      img: link.img,
      date: new Date(),
    })
  }

  return (
    <div
      aria-label="addLink"
      className={styles.addLink_container}
      style={getFloatStyle(isFloating, windowSize)}
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

export default AddLink
