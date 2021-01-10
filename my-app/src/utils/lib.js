import { nanoid } from "@reduxjs/toolkit"

//
//
//     COLOR
//
//

//////get user color//////
export const getColor = (id) => {
  const code = Math.floor(id.charCodeAt(0) * 4.86 - 233.28)
  return `hsl(${code},95%, 70%)`
}

export const getGradiet = (id) => {
  const code = Math.floor(id.charCodeAt(0) * 4.86 - 233.28)
  const nextCode = (code, i) =>
    code - 40 * i < 0 ? code - 40 * i + 360 : code - 40 * i
  const colorCode = `hsl(${code},90%, 55%)`
  const colorCode2 = `hsl(${nextCode(code, 1)},90%, 45%)`

  const style = {
    backgroundColor: colorCode,
    background: `linear-gradient(145deg, ${colorCode} 0%, ${colorCode2} 100% `,
  }

  return style
}

//category color code
export const colorCode = {
  //category
  food: "#33B679",
  food_shade: "rgba(51, 182, 121, 0.5)",
  hotel: "#F4511E",
  hotel_shade: "rgba(244, 81, 30, 0.5)",
  activity: "#ff9770",
  activity_shade: "rgba(255, 151, 112, 0.5)",
  commute: "#7986CB",
  commute_shade: "rgba(121, 134, 203, 0.5)",
  site: "#F6BF26",
  site_shade: "rgba(246, 191, 38, 0.5)",
  default: "#616161",
  default_shade: "rgba(97, 97, 97, 0.5)",

  //tag
  green: "#61bd4f",
  yellow: "#F2D600",
  pink: "#FF78CB",
  blue: "#00E2C0",
  orange: "#FF9F1A",
}

export const colorCode_tags = {
  //tag
  green: "#61bd4f",
  yellow: "#F2D600",
  pink: "#FF78CB",
  blue: "#00E2C0",
  orange: "#FF9F1A",
}

export const tagsTitle = (string) => {
  const title = {
    green: "綠色標籤",
    yellow: "黃色標籤",
    pink: "粉色標籤",
    blue: "青色標籤",
    orange: "橘色標籤",
  }

  return title[string]
}

export const categoryTitle = (string) => {
  const title = {
    hotel: "住宿",
    activity: "活動",
    site: "景點",
    food: "食物",
    commute: "交通",
    default: "預設",
  }

  return title[string]
}

export const categories = [
  "hotel",
  "activity",
  "site",
  "food",
  "commute",
  "default",
]

export const emptyProject = {
  creator: "",
  title: "",
  members: [],
  tags: [
    {
      color: "orange",
      name: "",
      id: nanoid(),
    },
    {
      color: "blue",
      name: "",
      id: nanoid(),
    },
    {
      color: "yellow",
      name: "",
      id: nanoid(),
    },
    {
      color: "pink",
      name: "",
      id: nanoid(),
    },
    {
      color: "green",
      name: "",
      id: nanoid(),
    },
  ],
  created_time: null,
}

export const reactSelectsCustomStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: 30,
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 5,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 30,
  }),

  singleValue: (provided) => ({
    ...provided,
    fontSize: 14,
  }),
  option: (provided) => ({
    ...provided,
    fontSize: 14,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 14,
  }),
}

//
//
//     TIME
//
//

//////calculate comment time//////
export const getTime = (dateString) => {
  let commentedTime = new Date(dateString).getTime()
  let currentTime = new Date().getTime()

  //to second
  let interval = Math.floor((currentTime - commentedTime) / 1000)

  if (interval < 5) {
    return `目前`
  }

  if (interval < 60) {
    return `${interval}秒前`
  }

  //to minute
  interval = Math.floor(interval / 60)

  if (interval < 60) {
    return `${interval}分鐘前`
  }

  //to hour
  interval = Math.floor(interval / 60)
  if (interval < 24) {
    return `${interval}小時前`
  }

  //to day
  interval = Math.floor(interval / 24)
  if (interval < 30) {
    return `${interval}天前`
  }

  //to month
  interval = Math.floor(interval / 30)
  if (interval < 12) {
    return `${interval}月前`
  }

  //to year
  interval = Math.floor(interval / 12)
  return `${interval}年前`
}

//////get Date Header//////
export const getDateHeader = (dateObj, type) => {
  const dateConverter = (dateObj) => {
    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let temp = {
      MM_DD: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
      Day: dayNamesEn[dateObj.getDay()],
    }
    return temp
  }

  switch (type) {
    case "MMDD": {
      return dateConverter(dateObj).MM_DD
    }

    case "Day": {
      return dateConverter(dateObj).Day
    }
    default: {
      console.log("wrong type")
      break
    }
  }
}

//get pure date with hour, minute, second and millisecond
export const resetTime = (date) => {
  let temp = new Date(date.getTime())
  temp.setHours(0)
  temp.setMinutes(0)
  temp.setSeconds(0)
  temp.setMilliseconds(0)
  return temp
}

export const getInvitationUrl = (projectId) => {
  const origin = window.location.origin
  return origin + `/joinProject/${projectId}`
}

export const copyToClipboard = (value) => {
  const tempInput = document.createElement("input")
  tempInput.value = value
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand("copy")
  document.body.removeChild(tempInput)
}

export const getFloatStyle = (isfloating, windowSize) => {
  return {
    position: "fixed",
    width: `${isfloating.position.width}px`,
    left: `${isfloating.position.x}px`,
    top: windowSize.width > 700 && `${isfloating.position.y + 35}px`,
    bottom: windowSize.width < 700 && `10px`,
  }
}
