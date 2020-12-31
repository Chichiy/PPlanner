import React, { useRef } from "react"
import styles from "./LargeCard.module.scss"
import Link from "./Link"

const Links = ({ links, isfloating, setFloat }) => {
  const toggleAddLinkBtnRef = useRef(1)

  const toggleAddLinkBtn = (e) => {
    if (isfloating.type === "addLink") {
      setFloat(false)
    } else {
      let float = {
        type: "addLink",
        position: toggleAddLinkBtnRef.current.getBoundingClientRect(),
      }

      setFloat(float)
    }
  }

  return (
    <div className={styles.link_section}>
      <div className={styles.title}>附件</div>
      <div className={styles.container}>
        {/* {loading && <h3>Fetching link previews... 🤔🤔🤔</h3>} */}
        {links.map((data) => (
          <Link key={data.url} data={data} />
        ))}

        <div
          className={styles.toggleAddLinkBtn}
          onClick={toggleAddLinkBtn}
          ref={toggleAddLinkBtnRef}
        >
          增加附件
        </div>
      </div>
    </div>
  )
}

export default Links
