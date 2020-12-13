import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  Route,
  Switch,
  useHistory,
} from "react-router-dom"

import styles from "./largeCard.module.scss"

import {
  updateCard_Fs,
  listenToComments,
  listenToLinks,
  addComment_Fs,
  updateComment_Fs,
  removeComment_Fs,
  addLink_Fs,
  updateLink_Fs,
  removeLink_Fs,
} from "../../../../../firebase/Config"
import { current, nanoid } from "@reduxjs/toolkit"

import { getTime, getColor } from "../../../../lib"

const LargeCard = () => {
  const { projectId, cardId } = useParams()
  const card = useSelector((state) =>
    state.cards.find((card) => card.id === cardId)
  )
  const history = useHistory()
  const dispatch = useDispatch()

  //////updates//////
  const updateTitle = (input) => {
    let change = {
      title: input,
    }
    updateCard_Fs(projectId, cardId, change)
  }

  const updateDescription = (input) => {
    let change = {
      description: input,
    }
    updateCard_Fs(projectId, cardId, change)
  }

  //close large card
  const closeCard = (e) => {
    let triggerElementId = ["closeBtn", "largeCardBackground"]

    if (triggerElementId.includes(e.target.id)) {
      history.goBack()
    }
  }

  //float menu
  const sideBar_addLink = useRef(2)
  const [isfloating, setFloat] = useState(false)

  const handleFloatMenu = (type, ref) => {
    if (!isfloating) {
      let float = {
        type: type,
        x: ref.current.getBoundingClientRect().x,
        y: ref.current.getBoundingClientRect().y,
      }
      setFloat(float)
    } else {
      setFloat(false)
    }
  }

  //links
  const [links, setLinks] = useState([])
  useEffect(() => {
    let unsubscribe = listenToLinks(
      cardId,
      handleAddLink,
      handleModifyLink,
      handleRemoveLink
    )

    return unsubscribe
  }, [])

  const handleAddLink = (res) => {
    if (links.findIndex((link) => link.id === res.id) < 0) {
      setLinks((prev) => [...prev, res])
    }
  }

  const handleModifyLink = (res) => {
    setLinks((prev) =>
      prev.map((link) => {
        return link.id === res.id ? res : link
      })
    )
  }

  const handleRemoveLink = (res, source) => {
    setLinks((prev) => prev.filter((link) => link.id !== res.id))
  }

  try {
    return (
      <div
        id="largeCardBackground"
        className={styles.card_large_background}
        onClick={closeCard}
      >
        <div className={styles.card_large}>
          {/* header */}
          <div className={styles.card_header}>
            <div className={styles.tag_icon}></div>
            <Title title={card.title} handleUpdateTitle={updateTitle} />
            <div id="closeBtn" className={styles.card_close}>
              X
            </div>
          </div>

          <div className={styles.card_main}>
            {/* tag section */}

            <div className={styles.tags_section}>
              <div className={styles.title}>標籤</div>
              <div className={styles.container}>
                {card.tags.map((tag) => {
                  return (
                    <div key={nanoid()} className={styles[`tag_${tag}`]}>
                      {tag}
                    </div>
                  )
                })}

                <div className={styles.new_tag}>+</div>
              </div>
            </div>

            {/* discription section */}

            <Description
              description={card.description}
              handleUpdateDescription={updateDescription}
            />
            {links.length > 0 && (
              <Links
                links={links}
                isfloating={isfloating}
                setFloat={setFloat}
              />
            )}
            {/* comments section */}

            <Comments cardId={cardId} projectId={projectId} />
          </div>

          {/* side bar */}
          <div className={styles.card_sideBar}>
            <div className={styles.title}>新增至卡片</div>
            <div className={styles.button_sideBar}>待辦事項</div>
            {card.links ? null : (
              <div
                ref={sideBar_addLink}
                className={styles.button_sideBar}
                onClick={() => {
                  handleFloatMenu("addLink", sideBar_addLink)
                }}
              >
                附件
              </div>
            )}
            <div className={styles.button_sideBar}>預估花費</div>
            <div className={styles.button_sideBar}>預估時長</div>
          </div>

          {/* float menu */}
          <FloatMenu
            cardId={cardId}
            isfloating={isfloating}
            setFloat={setFloat}
            links={links}
            setLinks={setLinks}
          />
        </div>
      </div>
    )
  } catch {
    return null
  }
}
export default LargeCard

////////////floating menu////////////
const FloatMenu = ({ cardId, isfloating, setFloat, links, setLinks }) => {
  const [url, setUrl] = useState("")
  // const [loading, setLoading] = useState(false)
  // const [links, setLinks] = useState([])

  switch (isfloating.type) {
    case "addLink": {
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

      return (
        <AddLink
          url={url}
          setUrl={setUrl}
          handleSubmit={handleSubmit}
          isfloating={isfloating}
        />
      )
    }
    default: {
      return null
    }
  }
}

////////////Title////////////

const Title = ({ title, handleUpdateTitle }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(title)

  const handleTitleEdit = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (e.target.value) {
        setEditing(!isEditing)
        handleUpdateTitle(e.target.value)
      } else {
        alert("請輸入卡片標題")
      }
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        className={styles.inputTitle}
        value={pending}
        onChange={(e) => setPending(e.target.value)}
        onBlur={handleTitleEdit}
        onKeyPress={handleTitleEdit}
        autoFocus
      />
    )
  } else {
    return (
      <div
        id="largeCardTitle"
        className={styles.card_title}
        onClick={() => setEditing(!isEditing)}
      >
        {title}
      </div>
    )
  }
}

////////////Description////////////

const Description = ({ description, handleUpdateDescription }) => {
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(description)

  const handleSave = (e) => {
    handleUpdateDescription(pending ? pending : "")
    setEditing(!isEditing)
  }

  const textAreaRef = useRef(0)
  const handleEdit = (e) => {
    try {
      // console.log(e)
      setPending(e.target.value)

      //auto-grow textarea
      let height = parseInt(getComputedStyle(e.target).height.slice(0, -2))
      let lineHeight = parseInt(
        getComputedStyle(e.target).lineHeight.slice(0, -2)
      )
      let padding = parseInt(getComputedStyle(e.target).padding.slice(0, -2))

      if (e.target.scrollHeight > height) {
        textAreaRef.current.style.height = `${
          e.target.scrollHeight + padding * 2
        }px`
      } else {
        while (height >= e.target.scrollHeight && e.target.scrollHeight >= 54) {
          textAreaRef.current.style.height = `${height - lineHeight}px`
          height -= lineHeight
        }
        textAreaRef.current.style.height = `${height + lineHeight}px`
      }
    } catch {
      console.error()
    }
  }

  return (
    <div className={styles.description_section}>
      <div className={styles.controll_bar}>
        <div className={styles.title}>描述</div>

        {/* edit/save btn */}
        {isEditing ? (
          <div className={styles.save_button} onClick={handleSave}>
            儲存
          </div>
        ) : (
          <div
            className={styles.edit_button}
            onClick={() => setEditing(!isEditing)}
          >
            編輯
          </div>
        )}
      </div>

      <div className={styles.container}>
        {/* textarea/display section */}
        {isEditing ? (
          <textarea
            ref={textAreaRef}
            type="text"
            className={styles.inputDescription}
            value={pending}
            onChange={handleEdit}
            // onFocus={handleEdit}
            onBlur={handleSave}
            autoFocus
            // onBlur={handleEdit}
            // onKeyPress={handleEdit}
          />
        ) : (
          <pre className={styles.description}>{description}</pre>
        )}
      </div>
    </div>
  )
}

////////////Links////////////

const Links = ({ links, isfloating, setFloat }) => {
  const toggleAddLinkBtnRef = useRef(1)

  const toggleAddLinkBtn = (e) => {
    if (isfloating.type === "addLink") {
      setFloat(false)
    } else {
      let float = {
        type: "addLink",
        x: toggleAddLinkBtnRef.current.getBoundingClientRect().x,
        y: toggleAddLinkBtnRef.current.getBoundingClientRect().y,
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
          <LinkItem key={data.url} data={data} />
        ))}

        <div
          className={styles.toggleAddLinkBtn}
          onClick={toggleAddLinkBtn}
          ref={toggleAddLinkBtnRef}
        >
          增加附件
        </div>
        {/* {isfloating.type === "addLink" && (
          <AddLink
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            isfloating={isfloating}
          />
        )} */}
      </div>
      {/* textarea/display section */}
      {/* {isEditing ? (
          <textarea
            ref={textAreaRef}
            type="text"
            className={styles.inputDescription}
            value={pending}
            onChange={handleEdit}
            // onFocus={handleEdit}
            onBlur={handleSave}
            autoFocus
            // onBlur={handleEdit}
            // onKeyPress={handleEdit}
          />
        ) : (
          <pre className={styles.description}>{description}</pre>
        )}
      </div> */}
    </div>
  )
}

const LinkItem = ({ data }) => {
  const title = useRef(0)

  const getTitle = () => {
    //slice the title more precisely, but only works when re-render
    // if (title.current.scrollHeight > title.current.clientHeight) {
    //   while (title.current.scrollHeight > title.current.clientHeight) {
    //     title.current.textContent = title.current.textContent.slice(0, -1)
    //   }
    //   title.current.textContent = title.current.textContent.slice(0, -3) + "..."
    //   return title.current.textContent
    // }

    // for the first render, slice with rough length
    if (data.title.length > 43) {
      return data.title.slice(0, 43) + "..."
    } else {
      return data.title
    }
  }

  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(data.title)

  const handleEditTitle = (e) => {
    if ((e.target.ariaLabel = "editBtn")) {
      if (isEditing && data.title !== pending) {
        updateLink(pending)
        setEditing(!isEditing)
      } else {
        setEditing(!isEditing)
      }
    }
  }

  const updateLink = (input) => {
    let change = {
      title: input,
    }
    updateLink_Fs(data.id, change)
  }

  const removeLink = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這個附件嗎？")

      if (yes) {
        removeLink_Fs(data.id)
      }
    }
  }

  return (
    <div className={styles.link_container} target="_blank" rel="noreferrer">
      <a className={styles.preview_img} href={data.url}>
        <img src={data.img} alt="link's thumbnail" />
      </a>
      <div className={styles.info}>
        {isEditing ? (
          <textarea
            className={styles.message}
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            autoFocus
          />
        ) : (
          <a className={styles.title} ref={title} href={data.url}>
            {getTitle()}
          </a>
        )}

        <div className={styles.tools}>
          <div className={styles.time}>{getTime(data.date)}</div>
          <div
            aria-label="removeBtn"
            className={styles.edit_button}
            onClick={removeLink}
          >
            移除
          </div>
          <div
            aria-label="editBtn"
            className={styles.edit_button}
            onClick={handleEditTitle}
          >
            編輯
          </div>
        </div>
      </div>
    </div>
  )
}

const AddLink = ({ url, setUrl, handleSubmit, isfloating }) => {
  return (
    <div
      className={styles.addLink_container}
      style={{
        position: "fixed",
        left: `${isfloating.x}px`,
        top: `${isfloating.y + 30}px`,
      }}
    >
      <div className={styles.addLink_span}>附加連結</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="請貼上連結"
        className={styles.addLink_input}
        autoFocus
      />
      <div
        className={styles.addLink_button}
        onClick={url ? handleSubmit : null}
      >
        附加
      </div>
    </div>
  )
}

//////Comments//////

const Comments = ({ cardId, projectId }) => {
  const userId = useSelector((state) => state.user.id)
  const [comments, setComments] = useState([])

  //get data from cloud
  useEffect(() => {
    let unsubscribe = listenToComments(
      cardId,
      handleAdd,
      handleModify,
      handleRemove
    )

    return unsubscribe
  }, [])

  const handleAdd = (res, source) => {
    //prevent repeatly adding when itinitallizing
    if (comments.findIndex((comment) => comment.id === res.id) < 0) {
      setComments((prev) => [...prev, res])
    }
  }

  const handleModify = (res) => {
    setComments((prev) =>
      prev.map((comment) => {
        return comment.id === res.id ? res : comment
      })
    )
  }

  const handleRemove = (res, source) => {
    setComments((prev) => prev.filter((comment) => comment.id !== res.id))
  }

  return (
    <div className={styles.comments_section}>
      <div className={styles.controll_bar}>
        <div className={styles.title}>留言</div>
      </div>
      <div className={styles.container}>
        {/* comment */}
        <AddComment cardId={cardId} userId={userId} />
        {comments.map((comment) => {
          return <Comment key={nanoid()} comment={comment} userId={userId} />
        })}
      </div>
    </div>
  )
}

const AddComment = ({ cardId, userId }) => {
  // const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState("")

  const addComment = (e) => {
    if (e.key === "Enter" && pending !== "") {
      let input = {
        card_id: cardId,
        sender_id: userId,
        content: pending,
        date: new Date(),
      }
      //update cloud data
      addComment_Fs(input)
      setPending("")
    }
  }

  const getColor = () => {
    let code = Math.floor(userId.charCodeAt(0) * 4.86 - 233.28)
    let colorCode = `hsl(${code},95%, 75%)`
    return colorCode
  }

  return (
    <div className={styles.comment}>
      <div className={styles.user} style={{ backgroundColor: getColor() }}>
        煞
      </div>
      <div className={styles.details}>
        <input
          className={styles.message}
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          placeholder="撰寫留言"
          onKeyPress={addComment}
        />
      </div>
    </div>
  )
}

const Comment = ({ comment, userId }) => {
  const isMyComment = userId === comment.sender_id

  //edit comment
  const [isEditing, setEditing] = useState(false)
  const [pending, setPending] = useState(comment.content)
  const handleEditComment = (e) => {
    if ((e.target.ariaLabel = "editBtn")) {
      if (isEditing) {
        updateComment(pending)
        setEditing(!isEditing)
      } else {
        setEditing(!isEditing)
      }
    }
  }

  const updateComment = (input) => {
    let change = {
      content: input,
    }
    updateComment_Fs(comment.id, change)
  }

  const removeComment = (e) => {
    if ((e.target.ariaLabel = "removeBtn")) {
      let yes = window.confirm("你確定要刪除這則留言嗎？")

      if (yes) {
        removeComment_Fs(comment.id)
      }
    }
  }

  const sender = useSelector((state) =>
    state.members.find((member) => member.id === comment.sender_id)
  )

  return (
    <div className={styles.comment}>
      <div
        className={styles.user}
        style={{ backgroundColor: getColor(sender.id) }}
      >
        {sender.name.slice(0, 1)}
      </div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.name}>{sender.name}</div>
          {/* <time>{comment.time}</time> */}
          <div className={styles.time}>{getTime(comment.date)}</div>
        </div>

        {isEditing ? (
          <textarea
            className={styles.message}
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            autoFocus
          />
        ) : (
          <pre className={styles.message}>{comment.content} </pre>
        )}

        {isMyComment ? (
          <div className={styles.tools}>
            <div
              aria-label="editBtn"
              className={styles.edit_button}
              onClick={handleEditComment}
            >
              編輯
            </div>
            <div
              aria-label="removeBtn"
              className={styles.edit_button}
              onClick={removeComment}
            >
              刪除
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
