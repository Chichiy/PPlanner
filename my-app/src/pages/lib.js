//
//
//     COLOR
//
//

//////get user color//////
export const getColor = (id) => {
  let code = Math.floor(id.charCodeAt(0) * 4.86 - 233.28)
  let colorCode = `hsl(${code},95%, 70%)`
  return colorCode
}

//category color code
export const colorCode = {
  //category
  food: "#ff70a6",
  hotel: "#020887",
  country: "#ff9770",
  commute: "#71a9f7",
  site: "#ecdd7b",
  default: "#e2e1df",

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
    const dayNamesEn = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]
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
