import { useRef, useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ListenToCardsRelatedData } from "../../firebase/lib"
import { useWindowSize } from "../../utils/customHooks"
import styles from "./LargeCard.module.scss"
import Link from "./Link"

const Links = ({ isFloating, setFloat }) => {
  const { cardId } = useParams()
  const [links, setLinks] = useState([])
  useEffect(() => {
    const unsubscribe = ListenToCardsRelatedData("links", cardId, handleChange)
    return unsubscribe
  }, [])

  const handleChange = (type, res) => {
    switch (type) {
      case "added": {
        //prevent repeatedly addition when initializing
        if (links.findIndex((link) => link.id === res.id) < 0) {
          setLinks((prev) => [...prev, res])
        }
        break
      }

      case "removed": {
        setLinks((prev) => prev.filter((link) => link.id !== res.id))
        break
      }

      default: {
        setLinks((prev) =>
          prev.map((link) => {
            return link.id === res.id ? res : link
          })
        )
      }
    }
  }

  const toggleAddLinkBtnRef = useRef(1)
  const windowSize = useWindowSize()
  const toggleAddLinkBtn = (e) => {
    if (isFloating.type === "addLink") {
      setFloat(false)
    } else {
      const float = {
        type: "addLink",
        position: toggleAddLinkBtnRef.current.getBoundingClientRect(),
      }

      // fix position for addLink button inside links section
      float.position.width = 200
      if (windowSize.width < 700) {
        float.position.width = windowSize.width - 20
        float.position.x = 10
      }

      setFloat(float)
    }
  }

  return links.length > 0 ? (
    <div className={styles.link_section}>
      <div className={styles.title}>附件</div>
      <div className={styles.container}>
        {links.map((data) => (
          <Link key={data.id} data={data} />
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
  ) : null
}

export default Links
