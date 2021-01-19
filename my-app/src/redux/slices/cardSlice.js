import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { deepEqual } from "../../utils/itineraryBoardLib"

export const modifyCardWithCheck = createAsyncThunk(
  "cards/modifyCardWithCheck",
  (res) => {
    return res
  },
  {
    condition: (res, { getState }) => {
      const { cards, user } = getState()
      const target = cards.find((card) => card.id === res.id)

      // First, check if the card is being dragged or not.
      // If it's dragged by myself, then stop updating
      // in order to prevent interrupting drag and drop process.
      if (res.isDragging && res.isDragging === user.id) {
        return false
      }

      // Second, check if response data is different from local state,
      // meaning that changes haven't been updated locally,
      // then allow update. Otherwise, prevent repeatedly update

      return !deepEqual(res, target)
    },
  }
)

export const cardSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {
    initCards: (state, action) => {
      const cards = action.payload.map((card) => {
        delete card.type
        return card
      })
      return cards
    },
    addCard: (state, action) => {
      const target = action.payload
      //prevent repeatedly adding when initializing
      if (state.findIndex((card) => card.id === target.id) < 0) {
        state.push(target)
      }
    },
    modifyCardProperties: (state, action) => {
      const target = action.payload
      const change = target.change
      const index = state.findIndex((card) => card.id === target.id)
      for (let key in change) {
        state[index][key] = change[key]
      }
    },
    removeCard: (state, action) => {
      const target = action.payload
      const index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1)
    },
    updateCardsOrder: (state, action) => {
      let result = action.payload.result

      //use cardId to find original position in whole cards array
      let souIndex = state.findIndex((card) => card.id === result.draggableId)
      let desIndex = state.findIndex(
        (card) => card.id === action.payload.destinationId
      )

      //extract target from original position
      let [reorderItem] = state.splice(souIndex, 1)

      //update isDragging info
      reorderItem.isDragging = false

      //put in new position
      state.splice(desIndex, 0, reorderItem)
    },
    clearCardsState: () => [],
  },
  extraReducers: {
    [modifyCardWithCheck.pending]: (state, action) => {
      // start checking cards state in thunk
    },
    [modifyCardWithCheck.fulfilled]: (state, action) => {
      let target = action.payload
      let index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1, target)
    },
  },
})

export const {
  initCards,
  addCard,
  modifyCardProperties,
  removeCard,
  updateCardsOrder,
  clearCardsState,
} = cardSlice.actions

export default cardSlice.reducer
