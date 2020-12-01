import React from "react"

// import styles from "./App.module.scss"

function Switch(props) {
  if (props.multi) {
    return (
      <div>
        Test ID:
        <input
          type="radio"
          name="tag"
          value="aJyjoGPEIH69isQ7QfYs"
          defaultChecked
          onChange={(e) => props.switchUser(e.target)}
        />
        <label>test</label>
        <input
          type="radio"
          name="tag"
          value="jFz7tkCgR2bTkzHJd1jU"
          onChange={(e) => props.switchUser(e.target)}
        />
        <label>tset2</label>
        <br />
      </div>
    )
  }
  return null
}

export default Switch
