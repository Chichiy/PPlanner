import React from "react"
import { useParams, useHistory } from "react-router-dom"
import Select from "react-select"
import { reactSelectsCustomStyles } from "../../utils/lib"

const BoardSelect = () => {
  const history = useHistory()
  const { projectId, boardType } = useParams()

  const options = [
    { value: "cards", label: "卡片板" },
    { value: "itineraries", label: "行程板" },
  ]
  const boardName = options.find((option) => option.value === boardType)

  const switchBoard = (e) => {
    const boardType = e.value
    history.push(`/projects/${projectId}/${boardType}`)
  }

  return (
    <Select
      styles={reactSelectsCustomStyles}
      options={options}
      value={boardName}
      onChange={switchBoard}
    />
  )
}

export default BoardSelect
