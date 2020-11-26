import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import styles from "./App.module.scss"
import { test, update, listenToData } from "./firebase/Config"

function App() {
  const [data, setData] = useState({})
  const [userId, setUserId] = useState("aJyjoGPEIH69isQ7QfYs")

  function switchUser(target) {
    setUserId(target.value)
  }

  useEffect(() => {
    listenToData(setData)
  }, [])

  return (
    <div>
      <textarea
        name="test"
        id="test"
        cols="30"
        rows="10"
        onChange={(e) => {
          if (!data.onChange || data.onChange === userId) {
            update("test", "2eddU3pn48Llu7Ji60Nz", {
              content: e.target.value,
              onChange: userId,
            })
          } else {
            console.log(`其他使用者${data.onChange}正在編輯`)
          }
        }}
        value={data.content}
      ></textarea>
      <br />

      <input
        type="radio"
        name="tag"
        value="aJyjoGPEIH69isQ7QfYs"
        defaultChecked
        onChange={(e) => switchUser(e.target)}
      />
      <label>test</label>
      <input
        type="radio"
        name="tag"
        value="jFz7tkCgR2bTkzHJd1jU"
        onChange={(e) => switchUser(e.target)}
      />
      <label>tset2</label>
      <br />

      <button onClick={test}>click</button>
    </div>
  )
}

export default App
