import { configureStore } from "@reduxjs/toolkit"

import itineraryReducer from "../pages/Project/feature/itineraryBoard/itinerarySlice"
import dayplanReducer from "../pages/Project/feature/itineraryBoard/dayplanSlice"
import cardReducer from "../pages/Project/feature/CardBoard/cardSlice"

export default configureStore({
  reducer: {
    itinerary: itineraryReducer,
    dayplans: dayplanReducer,
    cards: cardReducer,
  },
})
