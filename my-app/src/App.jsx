import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom"

import Navbar from "./pages/Navbar/Navbar"
import Projects from "./pages/Project/Projects"
import Home from "./pages/Home/Home"
import User, { CheckUser, Join } from "./pages/User/User"

export default function App() {
  return (
    <Router>
      <div>
        <CheckUser />
        <Switch>
          <Route path="/projects">
            <Projects />
          </Route>

          <Route path="/joinProject/:projectId">
            <Navbar type="default" />
            <Join />
          </Route>
          <Route path="/">
            <Navbar type="default" />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

// import React from "react"

// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

// import { test, update, listenToData } from "./firebase/Config"

// function App() {
// const [data, setData] = useState({})
// const [userId, setUserId] = useState("aJyjoGPEIH69isQ7QfYs")

// function switchUser(target) {
//   setUserId(target.value)
// }

// //註冊一次監聽事件
// useEffect(() => {
//   listenToData(setData)
// }, [])

/* <div>
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
      </div> */
