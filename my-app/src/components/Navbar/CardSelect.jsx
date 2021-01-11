import React, { useState, useEffect, useRef } from "react"
import { createSelector } from "@reduxjs/toolkit"
import {
  useRouteMatch,
  useLocation,
  useHistory,
  useParams,
} from "react-router-dom"
import { useSelector } from "react-redux"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import {
  categories,
  categoryTitle,
  tagsTitle,
  reactSelectsCustomStyles,
} from "../../utils/lib"

const CardSelect = () => {
  let history = useHistory()
  let match = useRouteMatch()
  const animatedComponents = makeAnimated()

  const { projectId } = useParams()
  const selectProjectTags = createSelector(
    (state) => state.projects,
    (projects) =>
      projects.find((project) => project.id === projectId)?.tags ?? []
  )
  const projectTags = useSelector(selectProjectTags)

  const selectCardsTags = createSelector(
    (state) => state.cards,
    (cards) => {
      const tagList = cards.reduce(function (prev, curr) {
        curr.tags.forEach((tag) => {
          !prev.includes(tag) && prev.push(tag)
        })
        return prev
      }, [])

      return tagList
    }
  )
  const cardsTags = useSelector(selectCardsTags)

  const options = categories.map((category) => ({
    value: category,
    label: categoryTitle(category),
  }))

  if (cardsTags.length > 0 && projectTags.length > 0) {
    cardsTags.forEach((tag) => {
      const curr = projectTags.find((projectTag) => projectTag.id === tag)

      options.push({
        value: tag,
        label: curr.name === "" ? tagsTitle(curr.color) : curr.name,
      })
    })
  }

  const location = useLocation()

  const handleValue = () => {
    return location.state?.tags
      ? options.filter((option) => location.state.tags.includes(option.value))
      : null
  }

  const handleChange = (e) => {
    let params = []
    let location
    if (e) {
      e.forEach((tag) => {
        params.push(tag.value)
      })
      location = {
        pathname: match.url,
        state: { tags: params },
      }
    } else {
      location = {
        pathname: `${match.url}`,
        state: { tags: null },
      }
    }
    history.replace(location)
  }

  return (
    <Select
      isMulti
      styles={reactSelectsCustomStyles}
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
