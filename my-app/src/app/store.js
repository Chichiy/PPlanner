import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/userSlice"
import membersReducer from "./slices/membersSlice"
import projectsReducer from "./slices/projectsSlice"
import cardReducer from "./slices/cardSlice"
import itineraryReducer from "./slices/itinerarySlice"
import dayplanReducer from "./slices/dayplanSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    members: membersReducer,
    projects: projectsReducer,
    cards: cardReducer,
    itinerary: itineraryReducer,
    dayplans: dayplanReducer,
  },
})
