import React, { useState } from "react"
import styles from "./LargeCard.module.scss"
import { addLink_Fs } from "../../firebase/Config"
import { getFloatStyle } from "../../utils/lib"
import { useWindowSize } from "../../utils/customHooks"

const AddLink = ({ isfloating, setFloat, cardId }) => {
  //input link holder
  const [url, setUrl] = useState("")
  // const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    // setLoading(true)
    setFloat(false)
    const cors = "https://cors-anywhere.herokuapp.com/"
    // const url = "https://andy6804tw.github.io/2019/09/21/fix-cors-problem/"

    const res = await fetch(cors + url)
    const data = await res.text()

    var parser = new DOMParser()
    var doc = parser.parseFromString(data, "text/html")
    let title = doc.querySelector("title").textContent
    let img = doc.querySelector("body").querySelector("img")

    //// img converter ////
    // get src
    img = img ? img.src : ""

    //update domain if using relative path
    let myOrigin = window.location.origin
    if (img.slice(0, myOrigin.length) === myOrigin) {
      let correctOrigin = new URL(url).origin
      let correctImgPath = correctOrigin + img.slice(origin.length)
      img = correctImgPath
    }

    let pending = {
      card_id: cardId,
      url: url,
      title: title,
      img: img,
      date: new Date(),
    }

    ///update fiebase
    addLink_Fs(pending)
    // setLoading(false)
    setUrl("")
  }

  const windowSize = useWindowSize()

  return (
    <div
      aria-label="addLink"
      className={styles.addLink_container}
      style={getFloatStyle(isfloating, windowSize)}
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
