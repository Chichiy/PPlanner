import DayJS from "react-dayjs"
import styles from "../../../../scss/itineraryBoard.module.scss"

//display responsive time on appointment card
export const responsiveTime = (card, snapshot, isExpanding) => {
  //case: edit time through expansion
  if (card.status === 1 && card.id === isExpanding) {
    console.log(card.id === isExpanding)

    let targetElement = document
      .querySelector(`[id="${card.id}"]`)
      .getBoundingClientRect()
    let targetHeight = targetElement.height
    let timeSpan = targetHeight / 20
    let startTime = new Date(card.start_time)
    let newEndTime = new Date(startTime.getTime() + timeSpan * 30 * 60 * 1000)

    return (
      <div className={styles.appointment_time} data-cardid={card.id}>
        {isNaN(timeSpan) ? null : (
          <div data-cardid={card.id}>
            <time data-cardid={card.id}>
              {startTime.getHours() < 10
                ? "0" + startTime.getHours()
                : startTime.getHours()}
              :{startTime.getMinutes() < 30 ? "00" : "30"}
            </time>

            <span data-cardid={card.id}>-</span>

            <time aria-label="expandEndTime" data-cardid={card.id}>
              {newEndTime.getHours() < 10
                ? "0" + newEndTime.getHours()
                : newEndTime.getHours()}
              :{newEndTime.getMinutes() < 30 ? "00" : "30"}
            </time>
          </div>
        )}
      </div>
    )
  }

  let hoverTime = new Date(Number(snapshot.draggingOver))
  let timeSpan

  //time span for re-arranging card
  if (card.status === 1) {
    timeSpan = new Date(card.end_time) - new Date(card.start_time)
  }

  //time span for new card with 1 hr span in default
  if (card.status === 0) {
    timeSpan = 60 * 60 * 1000
  }
  let hoverEndTime = new Date(hoverTime.getTime() + timeSpan)

  //case: display recorded time
  if (!snapshot.isDragging) {
    return (
      <div className={styles.appointment_time}>
        <DayJS format="HH:mm">{card.start_time}</DayJS>
        <span>-</span>
        <DayJS aria-label="expandEndTime" format="HH:mm">
          {card.end_time}
        </DayJS>
      </div>
    )
  } else {
    //case: display hover time while re-arranging card
    return (
      <div className={styles.appointment_time} data-cardid={card.id}>
        {isNaN(hoverTime.getHours()) ? null : (
          <div data-cardid={card.id}>
            <time data-cardid={card.id}>
              {hoverTime.getHours() < 10
                ? "0" + hoverTime.getHours()
                : hoverTime.getHours()}
              :{hoverTime.getMinutes() < 30 ? "00" : "30"}
            </time>

            <span data-cardid={card.id}>-</span>

            <time data-cardid={card.id}>
              {hoverEndTime.getHours() < 10
                ? "0" + hoverEndTime.getHours()
                : hoverEndTime.getHours()}
              :{hoverEndTime.getMinutes() < 30 ? "00" : "30"}
            </time>
          </div>
        )}
      </div>
    )
  }
}

// export const OnDragEnd = (dispatch, result, itinerary, filterCards) => {
//   //only fire when resonable placement
//   if (!result.destination) return
//   let desId = result.destination.droppableId
//   let souId = result.source.droppableId
//   let updateAction

//   //reorder in same droppable
//   if (desId === souId) {
//     switch (desId) {
//       case "cardsList": {
//         let destinationId = filterCards()[result.destination.index].id
//         updateAction = updateCardsOrder({
//           type: "cardsList",
//           result: result,
//           destinationId: destinationId,
//         })
//         break
//       }

//       default: {
//         updateAction = updateScheduleOrder({
//           type: "sameDayplan",
//           result: result,
//         })
//         break
//       }
//     }
//     dispatch(updateAction)
//   }
//   //drop in different droppable
//   else {
//     if (desId === "cardsList" || souId === "cardsList") {
//       let updateDestination, updateSource

//       if (desId === "cardsList") {
//         ////dayplan to cardlist////
//         let previousCard = filterCards()[result.destination.index - 1]
//         let desId_Previous = null
//         if (previousCard) {
//           desId_Previous = previousCard.id
//         }
//         updateDestination = updateCardsOrder({
//           type: "cross/add",
//           result: result,
//           desId_Previous: desId_Previous,
//         })

//         updateSource = updateScheduleOrder({
//           type: "cross/remove",
//           result: result,
//         })
//       }
//       if (souId === "cardsList") {
//         ////cardlist to dayplan////
//         updateDestination = updateScheduleOrder({
//           type: "cross/add",
//           result: result,
//         })

//         updateSource = updateCardsOrder({
//           type: "cross/remove",
//           result: result,
//           itineraryId: itinerary.id,
//         })
//       }
//       dispatch(updateDestination)
//       dispatch(updateSource)
//     } else {
//       ////dayplan to dayplan////

//       //update postion
//       updateAction = updateScheduleOrder({
//         type: "differentDayplans",
//         result: result,
//       })
//       dispatch(updateAction)

//       //update locations in card
//       let updateLocations = updateCardsOrder({
//         type: "updateLocations",
//         result: result,
//       })
//       dispatch(updateLocations)
//     }
//   }
// }
