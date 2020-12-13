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
  const dayplans = useSelector((state) => state.dayplans)
  const cards = useSelector((state) => state.cards)

  const getCardTitle = (id) => {
    let target = cards.find((item) => item.id === id)
    return target ? target.title : null
  }

  try {
    return (
      <div id="itineraryBoard" className={styles.itineraryBoard}>
        <div className={styles[`container_${dayplans.length}`]}>
          <div className={styles.year}>
            <span>2020</span>
          </div>
          <div className={styles.morning}>
            <span>上午</span>
          </div>
          <div className={styles.afternoon}>
            <span>下午</span>
          </div>
          <div className={styles.evening}>
            <span>晚上</span>
          </div>
          <div className={styles.hotel}>
            <span>住房</span>
          </div>

          {dayplans.map((dayplan, index) => {
            return (
              <Dates
                key={nanoid()}
                dayplan={dayplan}
                index={index}
                totalDays={dayplans.length}
              />
            )
          })}

          {dayplans.map((dayplan, index) => {
            if (dayplan.id) {
              return (
                <Droppable key={nanoid()} droppableId={dayplan.id}>
                  {(provided) => (
                    <div
                      className={styles[`dayplan_${index + 1}`]}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {dayplan.schedule.map((card, index) => {
                        if (card.card_id) {
                          return (
                            <Draggable
                              key={card.card_id}
                              draggableId={card.card_id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.card}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <div className={styles.cardTitle}>
                                    {getCardTitle(card.card_id)}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        }
                        return null
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )
            }
            return null
          })}
        </div>
      </div>
    )
  } catch {
    return null
  }
}

export default Dayplans

const Dates = ({ dayplan, index, totalDays }) => {
  const dateConverter = (dateString) => {
    const dayNamesEn = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]
    let date = new Date(dateString)
    let temp = {
      MM_DD: `${date.getMonth() + 1}/${date.getDate()}`,
      Day: dayNamesEn[date.getDay()],
    }
    return temp
  }

  const toMMDD = (input) => {
    return dateConverter(input).MM_DD
  }

  const toDay = (input) => {
    return dateConverter(input).Day
  }

  //add dayplan
  let itinerary_id = useSelector((state) => state.itinerary.id)

  const addDayplan = (type, date) => {
    let newDate = new Date(date)

    switch (type) {
      case "before": {
        newDate.setDate(newDate.getDate() - 1)
        let input = {
          itinerary_id: itinerary_id,
          schedule: [],
          date: new Date(newDate),
        }

        console.log(input)
        addDayplan_Fs(input)
        break
      }
      case "after": {
        newDate.setDate(newDate.getDate() + 1)
        let input = {
          itinerary_id: itinerary_id,
          schedule: [],
          date: new Date(newDate),
        }
        console.log(input)
        addDayplan_Fs(input)
        break
      }
      default: {
        console.log("wrong type")
        break
      }
    }
  }

  try {
    return (
      <div className={styles[`date_${index + 1}`]}>
        <div
          className={index === 0 ? styles.addDateBtn : styles.space}
          onClick={
            index === 0 ? () => addDayplan("before", dayplan.date) : null
          }
        ></div>
        <span className={styles.dateString}>{`${toMMDD(dayplan.date)} (${toDay(
          dayplan.date
        )})`}</span>
        <div
          className={index === totalDays - 1 ? styles.addDateBtn : styles.space}
          onClick={
            index === totalDays - 1
              ? () => addDayplan("after", dayplan.date)
              : null
          }
        ></div>
      </div>
    )
  } catch {
    return null
  }
}
