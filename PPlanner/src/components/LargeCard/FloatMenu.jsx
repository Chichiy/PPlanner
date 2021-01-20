import React from "react"
import Remove from "./Remove"
import AddLink from "./AddLink"
import AddTime from "./AddTime"
import AddTag from "./AddTag"
import ChangeMainTag from "./ChangeMainTag"

const FloatMenu = ({ card, cardId, isFloating, setFloat }) => {
  switch (isFloating.type) {
    case "addLink": {
      return (
        <AddLink isFloating={isFloating} setFloat={setFloat} cardId={cardId} />
      )
    }
    case "addTime": {
      return <AddTime card={card} isFloating={isFloating} setFloat={setFloat} />
    }
    case "addTag": {
      return <AddTag card={card} isFloating={isFloating} setFloat={setFloat} />
    }

    case "changeMainTag": {
      return (
        <ChangeMainTag
          card={card}
          isFloating={isFloating}
          setFloat={setFloat}
        />
      )
    }
    case "remove": {
      return <Remove isFloating={isFloating} setFloat={setFloat} />
    }
    default: {
      return null
    }
  }
}

export default FloatMenu
