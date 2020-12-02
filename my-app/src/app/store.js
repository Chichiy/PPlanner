import { configureStore } from "@reduxjs/toolkit"

import userReducer from "../pages/User/userSlice"
import projectsReducer from "../pages/Project/projectsSlice"
import cardReducer from "../pages/Project/feature/CardBoard/cardSlice"
import itineraryReducer from "../pages/Project/feature/itineraryBoard/itinerarySlice"
import dayplanReducer from "../pages/Project/feature/itineraryBoard/dayplanSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
    cards: cardReducer,
    itinerary: itineraryReducer,
    dayplans: dayplanReducer,
  },
})
