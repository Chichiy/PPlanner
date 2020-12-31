import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const modifyCardWithCheck = createAsyncThunk(
  "cards/modifyCardWithCheck",
  (res) => {
    return res
  },
  {
    condition: (res, { getState }) => {
      const { cards, user } = getState()
      const target = cards.find((card) => card.id === res.id)

      // Check if update needed.

      // First, check if the card is being dragged or not.
      // If it's dragged by myself, then stop updating
      // in order to prevent interrupting drag and drop process.
      if (res.isDragging && res.isDragging === user.id) {
        return false
      }

      // Second, check if response data is different from local state,
      // meaning that changes haven't been updated locally,
      // then allow update
      let keys = Object.keys(target)
      for (let i = 0; i < keys.length; i++) {
        if (res[keys[i]] !== target[keys[i]]) {
          return true
        }
      }
      //Otherwise, prevent repeatly update
      return false
    },
  }
)

export const cardSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {
    clearCardsState: (state, action) => {
      state.splice(0, state.length)
    },

    addCard: (state, action) => {
      let target = action.payload

      //prevent repeatly adding when itinitallizing
      if (state.findIndex((card) => card.id === target.id) < 0) {
        state.push(target)
      }
    },
    modifyCard: (state, action) => {
      let target = action.payload
      let index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1, target)
    },

    modifyCardProperties: (state, action) => {
      let target = action.payload
      let change = target.change
      let index = state.findIndex((card) => card.id === target.id)
      for (let key in change) {
        state[index][key] = change[key]
      }
    },

    removeCard: (state, action) => {
      let target = action.payload
      let index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1)
    },

    updateCardsOrder: (state, action) => {
      let result = action.payload.result

      //use cardId to find original postion in whole cards array
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
  addCard,
  removeCard,
  modifyCard,
  updateCardsOrder,
  modifyCardProperties,
  clearCardsState,
} = cardSlice.actions

export default cardSlice.reducer
