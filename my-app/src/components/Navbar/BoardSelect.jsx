import React from "react"
import { useParams, useHistory } from "react-router-dom"
import Select from "react-select"
import { reactSelectsCustomStyles } from "../../utils/lib"

const BoardSelect = ({ type }) => {
  let history = useHistory()
  let { projectId } = useParams()

  let options = [
    { value: "cards", label: "卡片板" },
    { value: "itineraries", label: "行程板" },
  ]
  const thisBoard = () => {
    return options.findIndex((option) => option.value === type)
  }

  const handleChange = (e) => {
    //update URL
    let boardType = e.value
    let location
    switch (boardType) {
      case "itineraries": {
        location = {
          pathname: `/projects/${projectId}/${boardType}`,
        }
        break
      }
      default: {
        location = {
          pathname: `/projects/${projectId}/${boardType}`,
        }
      }
    }
    history.push(location)
  }

  return (
    <Select
      styles={reactSelectsCustomStyles}
      options={options}
      value={options[thisBoard()]}
      onChange={handleChange}
    />
  )
}

export default BoardSelect
