import { createSlice } from "@reduxjs/toolkit"

export const itinerarySlice = createSlice({
  name: "itinerary",
  initialState: {},
  reducers: {
    initItinerary: (state, action) => {
      for (let key in action.payload) {
        state[key] = action.payload[key]
      }
    },
    deleteDayplan: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { initItinerary } = itinerarySlice.actions

export default itinerarySlice.reducer
