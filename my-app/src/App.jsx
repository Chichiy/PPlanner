import React, { useState } from "react"
import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import styles from "./App.module.scss"
import { test, update, listenToData } from "./firebase/Config"

function App() {
  const [content, setContent] = useState("")

  // let data = {
  //   title: "title",
  //   content: content,
  //   // created_time: firebase.firestore.FieldValue.serverTimestamp(),
  // }

  listenToData(setContent)

  return (
    <div>
      <textarea
        name="test"
        id="test"
        cols="30"
        rows="10"
        onChange={(e) => {
          // setContent(e.target.value)
          update(e.target.value)
        }}
        value={content}
      ></textarea>
      <button onClick={test}>click</button>
    </div>
  )
}

export default App
