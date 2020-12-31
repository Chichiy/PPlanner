import React from "react"
import Remove from "./Remove"
import AddLink from "./AddLink"
import AddTime from "./AddTime"
import AddTag from "./AddTag"
import ChangeMainTag from "./ChangeMainTag"

const FloatMenu = ({ card, cardId, isfloating, setFloat }) => {
  switch (isfloating.type) {
    case "addLink": {
      return (
        <AddLink isfloating={isfloating} setFloat={setFloat} cardId={cardId} />
      )
    }
    case "addTime": {
      return <AddTime card={card} isfloating={isfloating} setFloat={setFloat} />
    }
    case "addTag": {
      return <AddTag card={card} isfloating={isfloating} setFloat={setFloat} />
    }

    case "changeMainTag": {
      return (
        <ChangeMainTag
          card={card}
          isfloating={isfloating}
          setFloat={setFloat}
        />
      )
    }
    case "remove": {
      return <Remove isfloating={isfloating} setFloat={setFloat} />
    }
    default: {
      return null
    }
  }
}

export default FloatMenu
