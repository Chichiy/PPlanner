import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./slices/userSlice"
import membersReducer from "./slices/membersSlice"
import projectsReducer from "./slices/projectsSlice"
import cardReducer from "./slices/cardSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    members: membersReducer,
    projects: projectsReducer,
    cards: cardReducer,
  },
})
