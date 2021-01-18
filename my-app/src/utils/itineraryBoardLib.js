export const timeSlotHeight = 20

export const getFormatTime = (time) => {
  const hour = time.getHours()
  const minute = time.getMinutes()
  return `${hour < 10 ? "0" + hour : hour}:${minute < 30 ? "00" : "30"}`
}

export const responsiveTime = (Component, card, snapshot, isExpanding) => {
  let type
  let startTime
  let endTime

  if (card.status === 1 && card.id === isExpanding) {
    type = "EXPANDING"
  } else if (snapshot.isDragging) {
    type = "REARRANGING"
  } else {
    type = "STATIC"
  }

  switch (type) {
    case "EXPANDING": {
      const getEndTime = (card) => {
        const targetElement = document
          .querySelector(`[id="${card.id}"]`)
          .getBoundingClientRect()
        const targetHeight = targetElement.height
        const timeSpan = targetHeight / timeSlotHeight
        return new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)
      }

      startTime = new Date(card.start_time)
      endTime = getEndTime(card)

      break
    }

    case "REARRANGING": {
      const getEndTime = (card, hoverTime) => {
        const timeSpan =
          card.status === 1
            ? new Date(card.end_time) - new Date(card.start_time) // time span for re-arranging card
            : 60 * 60 * 1000 // 1 hour span for new card by default

        return new Date(hoverTime.getTime() + timeSpan)
      }

      startTime = new Date(Number(snapshot.draggingOver))
      endTime = getEndTime(card, startTime)

      break
    }

    default: {
      // default: STATIC
      startTime = new Date(card.start_time)
      endTime = new Date(card.end_time)
    }
  }

  return <Component card={card} startTime={startTime} endTime={endTime} />
}

export const deepEqual = (a, b) => {
  const jsonEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  const compareObject = (a, b) => {
    const keys = Object.keys(a)
    for (let i = 0; i < keys.length; i++) {
      if (a[keys[i]] !== b[keys[i]]) {
        if (a[keys[i]] instanceof Array) {
          if (!jsonEqual(a[keys[i]], b[keys[i]])) {
            return false
          }
        } else if (a[keys[i]] instanceof Object) {
          if (!compareObject(a[keys[i]], b[keys[i]])) {
            return false
          }
        } else {
          return false
        }
      }
    }
    return true
  }

  return compareObject(a, b)
}
