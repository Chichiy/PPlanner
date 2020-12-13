//tools
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { nanoid } from "nanoid"
import { Draggable, Droppable } from "react-beautiful-dnd"

//components and scss
import styles from "../../../../scss/itineraryBoard.module.scss"

import { addDayplan_Fs } from "../../../../firebase/Config"

const Dayplans = () => {
  //needed state
  // const dayplans = useSelector((state) => state.dayplans)
  const cards = useSelector((state) =>
    state.cards.filter((card) => card.status === 1)
  )
  const time = new Date(2020, 11, 28)
  const [date, setDates] = useState(time)

  const getDates = () => {
    let temp = []
    for (let i = 0; i < 8; i++) {
      let newDate = new Date()

      if (i === 0) {
        temp.push(<td></td>)
      } else {
        newDate.setDate(date.getDate() + i - 1)
        temp.push(<td>{newDate.getMonth() + 1 + "/" + newDate.getDate()}</td>)
      }
    }
    return temp
  }

  const getRow = () => {
    console.log("fire")
    let row = []
    for (let i = 0; i < 48; i++) {
      let temp = []
      for (let j = 0; j < 8; j++) {
        if (j === 0) {
          if (i % 2 === 0) {
            temp.push(<td rowSpan="2">{`${i / 2}:00`}</td>)
          }
        } else {
          temp.push(
            <Droppable
              key={nanoid()}
              droppableId={
                // date and starttime
                `${
                  date.getTime() +
                  (j - 1) * 24 * 60 * 60 * 1000 +
                  i * 30 * 60 * 1000
                }`
              }
            >
              {(provided) => (
                <td {...provided.droppableProps} ref={provided.innerRef}>
                  {i + 1}
                  {/* {provided.placeholder} */}
                </td>
              )}
            </Droppable>
          )
        }
      }

      row.push(<tr>{temp}</tr>)
    }
    return row
  }

  const getCardTitle = (id) => {
    let target = cards.find((item) => item.id === id)
    return target ? target.title : null
  }

  const style = (card, snapshot, provided) => {
    let colorCode = {
      food: "#ff70a6",
      hotel: "#020887",
      country: "#ff9770",
      commute: "#71a9f7",
      site: "#ecdd7b",
      default: "#e2e1df",
    }

    let day = new Date(card.start_time)
    let dayIndex = Math.floor(Math.abs(day - date) / 24 / 60 / 60 / 1000)

    let startTime = day.getHours() * 2 + (day.getMinutes() >= 30 ? 1 : 0) + 1

    let endTime = new Date(card.end_time)
    let timeSpan = Math.ceil((endTime.getTime() - day.getTime()) / 60000 / 30)
    let temp

    temp = {
      position: "absolute",
      backgroundColor: colorCode[card.category],
      top: `${startTime * 37 + 50}px`,
      left: `${(dayIndex + 1) * 12.5}%`,
      height: `${timeSpan * 37}px`,
      ...provided.draggableProps.style,
    }

    console.log(card.title, `${(dayIndex + 1) * 12.5}%`)
    return temp
  }

  return (
    <div id="itineraryBoard" className={styles.itineraryBoard}>
      <table>
        <tbody className={styles.tbody}>
          <tr>{getDates()}</tr>
          {getRow()}
        </tbody>
      </table>

      <Droppable
        key={nanoid()}
        droppableId={"appointments"}
        isDropDisabled={true}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.fix_Droppable}
          >
            {cards.map((card, index) => {
              return (
                <Draggable key={nanoid()} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={style(card, snapshot, provided)}
                      ref={provided.innerRef}
                      className={styles.fix_darggable}
                    >
                      <div>{card.title}</div>
                    </div>
                  )}
                </Draggable>
              )
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )

  //   <div className={styles[`container_${dayplans.length}`]}>
  //     <div className={styles.year}>
  //       <span>2020</span>
  //     </div>
  //     <div className={styles.morning}>
  //       <span>上午</span>
  //     </div>
  //     <div className={styles.afternoon}>
  //       <span>下午</span>
  //     </div>
  //     <div className={styles.evening}>
  //       <span>晚上</span>
  //     </div>
  //     <div className={styles.hotel}>
  //       <span>住房</span>
  //     </div>

  //     {dayplans.map((dayplan, index) => {
  //       return (
  //         <Dates
  //           key={nanoid()}
  //           dayplan={dayplan}
  //           index={index}
  //           totalDays={dayplans.length}
  //         />
  //       )
  //     })}

  //     {dayplans.map((dayplan, index) => {
  //       if (dayplan.id) {
  //         return (
  //           <Droppable key={nanoid()} droppableId={dayplan.id}>
  //             {(provided) => (
  //               <div
  //                 className={styles[`dayplan_${index + 1}`]}
  //                 {...provided.droppableProps}
  //                 ref={provided.innerRef}
  //               >
  //                 {dayplan.schedule.map((card, index) => {
  //                   if (card.card_id) {
  //                     return (
  //                       <Draggable
  //                         key={card.card_id}
  //                         draggableId={card.card_id}
  //                         index={index}
  //                       >
  //                         {(provided) => (
  //                           <div
  //                             className={styles.card}
  //                             {...provided.draggableProps}
  //                             {...provided.dragHandleProps}
  //                             ref={provided.innerRef}
  //                           >
  //                             <div className={styles.cardTitle}>
  //                               {getCardTitle(card.card_id)}
  //                             </div>
  //                           </div>
  //                         )}
  //                       </Draggable>
  //                     )
  //                   }
  //                   return null
  //                 })}
  //                 {provided.placeholder}
  //               </div>
  //             )}
  //           </Droppable>
  //         )
  //       }
  //       return null
  //     })}
  //   </div>
  // </div>
}

export default Dayplans

// const Dates = ({ dayplan, index, totalDays }) => {
//   const dateConverter = (dateString) => {
//     const dayNamesEn = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]
//     let date = new Date(dateString)
//     let temp = {
//       MM_DD: `${date.getMonth() + 1}/${date.getDate()}`,
//       Day: dayNamesEn[date.getDay()],
//     }
//     return temp
//   }

//   const toMMDD = (input) => {
//     return dateConverter(input).MM_DD
//   }

//   const toDay = (input) => {
//     return dateConverter(input).Day
//   }

//add dayplan
//   let itinerary_id = useSelector((state) => state.itinerary.id)

//   const addDayplan = (type, date) => {
//     let newDate = new Date(date)

//     switch (type) {
//       case "before": {
//         newDate.setDate(newDate.getDate() - 1)
//         let input = {
//           itinerary_id: itinerary_id,
//           schedule: [],
//           date: new Date(newDate),
//         }

//         console.log(input)
//         addDayplan_Fs(input)
//         break
//       }
//       case "after": {
//         newDate.setDate(newDate.getDate() + 1)
//         let input = {
//           itinerary_id: itinerary_id,
//           schedule: [],
//           date: new Date(newDate),
//         }
//         console.log(input)
//         addDayplan_Fs(input)
//         break
//       }
//       default: {
//         console.log("wrong type")
//         break
//       }
//     }
//   }

//   try {
//     return (
//       <div className={styles[`date_${index + 1}`]}>
//         <div
//           className={index === 0 ? styles.addDateBtn : styles.space}
//           onClick={
//             index === 0 ? () => addDayplan("before", dayplan.date) : null
//           }
//         ></div>
//         <span className={styles.dateString}>{`${toMMDD(dayplan.date)} (${toDay(
//           dayplan.date
//         )})`}</span>
//         <div
//           className={index === totalDays - 1 ? styles.addDateBtn : styles.space}
//           onClick={
//             index === totalDays - 1
//               ? () => addDayplan("after", dayplan.date)
//               : null
//           }
//         ></div>
//       </div>
//     )
//   } catch {
//     return null
//   }
// }
