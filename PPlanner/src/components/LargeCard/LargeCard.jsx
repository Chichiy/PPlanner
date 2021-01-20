import React, { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import styles from "./LargeCard.module.scss"
import { FS } from "../../firebase/lib"
import Tags from "./Tags"
import RedirectButton from "./RedirectButton"
import FloatMenu from "./FloatMenu"
import CardTitle from "./CardTitle"
import Links from "./Links"
import Comments from "./Comments"
import Description from "./Description"

const LargeCard = () => {
  const { projectId, cardId } = useParams()
  const card = useSelector((state) =>
    state.cards.find((card) => card.id === cardId)
  )
  const history = useHistory()

  //////updates//////

  const updateDescription = (input) => {
    let change = {
      description: input,
    }
    FS.cards.update(projectId, cardId, change)
  }

  //handle close
  const close = (e) => {
    let triggerElementId = ["closeBtn", "largeCardBackground"]

    // close floating menu if onblur
    if (isFloating && e.target.ariaLabel !== isFloating.type) {
      //prevent close on react-datepicker
      if (
        e.target.className.slice(0, 5) === "react" ||
        e.target.getAttribute("aria-labelledBy") === "addTime"
      ) {
        return
      }

      setFloat(false)
      //close card if click on click btn
      if (e.target.id === "closeBtn") {
        history.goBack()
      }
      return
    }

    //close card
    if (triggerElementId.includes(e.target.id)) {
      history.goBack()
      return
    }
  }

  //float menu
  const [isFloating, setFloat] = useState(false)
  const sideBar_addLink = useRef(null)
  const sideBar_addTime = useRef(null)
  const sideBar_remove = useRef(null)

  const handleFloatMenu = (type, ref) => {
    if (!isFloating) {
      const float = {
        type: type,
        position: ref.current.getBoundingClientRect(),
      }
      setFloat(float)
    } else {
      setFloat(false)
    }
  }

  try {
    return (
      <div
        id="largeCardBackground"
        className={styles.card_large_background}
        onClick={close}
      >
        <div className={styles.card_large}>
          {/* header */}
          <div className={styles.card_header}>
            <div className={styles.tag_icon}></div>
            <CardTitle title={card.title} />
            <div id="closeBtn" className={styles.card_close}></div>
          </div>

          {/* main */}
          <div className={styles.card_main}>
            <Tags
              card={card}
              projectId={projectId}
              isFloating={isFloating}
              setFloat={setFloat}
            />
            <Description
              description={card.description}
              handleUpdateDescription={updateDescription}
            />
            <Links isFloating={isFloating} setFloat={setFloat} />
            <Comments />
          </div>

          {/* side bar */}
          <div className={styles.card_sideBar}>
            <div className={styles.title}>新增至卡片</div>
            {card.links ? null : (
              <div
                aria-label="addLink"
                ref={sideBar_addLink}
                className={styles.sidebar_button_addlink}
                onClick={() => {
                  handleFloatMenu("addLink", sideBar_addLink)
                }}
              >
                附件
              </div>
            )}
            <div
              aria-label="addTime"
              ref={sideBar_addTime}
              className={styles.sidebar_button_addtime}
              onClick={() => {
                handleFloatMenu("addTime", sideBar_addTime)
              }}
            >
              安排時間
            </div>
            <RedirectButton />

            <div
              aria-label="remove"
              ref={sideBar_remove}
              className={styles.sidebar_button_remove}
              onClick={() => {
                handleFloatMenu("remove", sideBar_remove)
              }}
            >
              刪除
            </div>
          </div>

          {/* float menu */}
          <FloatMenu
            card={card}
            cardId={cardId}
            isFloating={isFloating}
            setFloat={setFloat}
          />
        </div>
      </div>
    )
  } catch {
    return null
  }
}
export default LargeCard
