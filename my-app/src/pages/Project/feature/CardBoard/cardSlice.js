import { createSlice } from "@reduxjs/toolkit"

export const cardSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {
    initCards: (state, action) => {
      let cards = action.payload

      if (!cards instanceof Array) {
        state.splice(0, 1, cards)
      } else {
        state.pop()
        cards.forEach((card) => {
          state.push(card)
        })
      }
    },
  },
})

export const { initCards } = cardSlice.actions

export default cardSlice.reducer
