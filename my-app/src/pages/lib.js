//calculate comment time
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

//get user color
export const getColor = (id) => {
  let code = Math.floor(id.charCodeAt(0) * 4.86 - 233.28)
  let colorCode = `hsl(${code},95%, 70%)`
  return colorCode
}
