import React, { useState, useEffect } from "react"
import {
  useRouteMatch,
  useLocation,
  useHistory,
  useParams,
} from "react-router-dom"
import { useSelector } from "react-redux"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import { reactSelectsCustomStyles } from "../../utils/lib"

const CardSelect = () => {
  let history = useHistory()
  let match = useRouteMatch()
  const animatedComponents = makeAnimated()

  const { projectId } = useParams()
  const thisProject = (state) =>
    state.projects.find((project) => project.id === projectId)
  const project = useSelector(thisProject)

  //prepare options
  const tags = project ? project.tags : []
  const cards = useSelector((state) => state.cards)
  const [options, setOptions] = useState([])

  useEffect(() => {
    //get all added tag's id from each card
    let tagList = cards.reduce(function (prev, curr) {
      curr.tags.forEach((tag) => {
        if (!prev.includes(tag)) {
          prev.push(tag)
        }
      })
      return prev
    }, [])

    try {
      tagList.forEach((tagId, index) => {
        tagList[index] = tags.find((tag) => tag.id === tagId).name
      })
    } catch {
      tagList = []
    }
    const capitalize = (string) => {
      return string.slice(0, 1).toUpperCase() + string.slice(1)
    }

    let temp = []
    tagList.forEach((tag) => {
      temp.push({
        value: tag,
        label: capitalize(tag),
      })
      setOptions(temp)
    })
  }, [cards, tags])

  //get searched tags from URL
  const useQuery = () => {
    let tagString = new URLSearchParams(useLocation().search).get("tag")
    return tagString ? tagString.split(" ") : null
  }
  let searchTags = useQuery()
  const handleValue = () => {
    return searchTags
      ? options.filter((option) => searchTags.includes(option.value))
      : null
  }

  //update URL when search
  const handleChange = (e) => {
    let params = []
    let location
    if (e) {
      e.forEach((tag) => {
        params.push(tag.value)
      })
      location = {
        pathname: `${match.url}` + `${match.url.slice(-1) === "/" ? "" : "/"}`,
        search: `?tag=${params.join("+")}`,
        // state: { tags: params },
      }
    } else {
      location = {
        pathname: `${match.url}`,
        // state: { tags: false },
      }
    }
    history.push(location)
  }

  return (
    <Select
      styles={reactSelectsCustomStyles}
      isMulti
      options={options}
      value={handleValue()}
      onChange={handleChange}
      closeMenuOnSelect={false}
      components={animatedComponents}
      placeholder="搜尋卡片標籤"
    />
  )
}

export default CardSelect
