import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import styles from "../../../../scss/itineraryBoard.module.scss"

import { getFsData, getFsData_Cards } from "../../../../firebase/Config"
import { initDayplans } from "./dayplanSlice"
import { initCards } from "../CardBoard/cardSlice"

const ItineraryBoard = () => {
  //needed state
  //selected cards(by tags)
  //itinerary info title, id, dayplan_id
  //dayplans info + realted cards

  //updated state
  //itineray'title
  //add cards
  //modified cards

  //import needed state
  let thisItinerary = (state) => state.itinerary
  const itinerary = useSelector(thisItinerary)

  let thisDayplans = (state) => state.dayplans
  const dayplans = useSelector(thisDayplans)

  let thisCards = (state) => state.cards
  const cards = useSelector(thisCards)

  //register needed dispatch
  const dispatch = useDispatch()

  //init
  useEffect(() => {
    //dayplans
    getFsData("dayplans", "itinerary_id", "==", itinerary.id).then((res) => {
      dispatch(initDayplans(res))
    })
    //cards
    getFsData_Cards("mG06SIS2LbvuKWOXdNSE").then((res) => {
      dispatch(initCards(res))
    })
  }, [])

  return (
    <div className={styles.view}>
      <div className={styles.navBar}></div>
      <div id="cardList" className={styles.cardList}>
        {cards.map((card) => {
          return (
            <div className={styles.card}>
              <div className={styles.cardTitle}>{card.title}</div>
            </div>
          )
        })}
      </div>
      <div id="ItineraryBoard" className={styles.itineraryBoard}>
        <div className={styles.container}>
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
          <div className={styles.date_1}>
            <span>12/28 (MON.)</span>
          </div>
          <div className={styles.date_2}>
            <span>12/29 (TUE.)</span>
          </div>

          {dayplans.map((dayplans, index) => {
            return (
              <div className={styles[`dayplan_${index + 1}`]}>
                {dayplans.schedule.map((card, index) => {
                  return (
                    <div className={styles.card}>
                      <div className={styles.cardTitle}>{card.card_id}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ItineraryBoard
