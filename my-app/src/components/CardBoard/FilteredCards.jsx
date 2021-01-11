import React from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import SmallCard from "./SmallCard"

const FilteredCards = () => {
  const cards = useSelector((state) => state.cards)
  const location = useLocation()
  const filters = location.state?.tags
  const passFilter = (tag) => (filters ? filters.includes(tag) : true)
  const cardTags = (card) => {
    return [card.category, ...card.tags]
  }

  return cards.map((card) => {
    if (cardTags(card).some(passFilter)) {
      return <SmallCard key={card.id} card={card} />
    }
  })
}

export default FilteredCards
