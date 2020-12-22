import DayJS from "react-dayjs"
import styles from "../../../../scss/itineraryBoard.module.scss"

//display responsive time on appointment card
export const responsiveTime = (card, snapshot) => {
  let hoverTime = new Date(Number(snapshot.draggingOver))
  let timeSpan = new Date(card.end_time) - new Date(card.start_time)
  let hoverEndTime = new Date(hoverTime.getTime() + timeSpan)

  if (!snapshot.isDragging) {
    return (
      <div className={styles.appointment_time}>
        <DayJS format="HH:mm">{card.start_time}</DayJS>
        <span>-</span>
        <DayJS format="HH:mm">{card.end_time}</DayJS>
      </div>
    )
  } else {
    return (
      <div className={styles.appointment_time}>
        {isNaN(hoverTime.getHours()) ? null : (
          <div>
            <time>
              {hoverTime.getHours() < 10
                ? "0" + hoverTime.getHours()
                : hoverTime.getHours()}
              :{hoverTime.getMinutes() < 30 ? "00" : "30"}
            </time>

            <span>-</span>

            <time>
              {hoverTime.getHours() < 10
                ? "0" + hoverTime.getHours()
                : hoverTime.getHours()}
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
