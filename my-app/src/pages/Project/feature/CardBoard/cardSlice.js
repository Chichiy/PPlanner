import { createSlice } from "@reduxjs/toolkit"

export const cardSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {
    addCard: (state, action) => {
      let target = action.payload

      //prevent repeatly adding
      if (state.findIndex((card) => card.id === target.id) < 0) {
        state.push(target)
      }
    },
    removeCard: (state, action) => {
      let target = action.payload
      let index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1)
    },
    modifyCard: (state, action) => {
      let target = action.payload
      let index = state.findIndex((card) => card.id === target.id)
      state.splice(index, 1, target)
    },

    updateCardsOrder: (state, action) => {
      switch (action.payload.type) {
        case "cardsList": {
          let result = action.payload.result

          //use cardId to find original postion in whole cards array
          let souIndex = state.findIndex(
            (card) => card.id === result.draggableId
          )
          let desIndex = state.findIndex(
            (card) => card.id === action.payload.destinationId
          )

          //extract target from original position
          let [reorderItem] = state.splice(souIndex, 1)

          //put in new position
          state.splice(desIndex, 0, reorderItem)
          break
        }

        case "cross/add": {
          let result = action.payload.result

          //prepare format
          let targetIndex = state.findIndex(
            (card) => card.id === result.draggableId
          )
          let target = state[targetIndex]
          target.status = 0

          //update locations info
          let souId = result.source.droppableId
          let locationIndex = target.locations.findIndex(
            (location) => location.dayplan_id === souId
          )
          target.locations.splice(locationIndex, 1)

          let desIndex =
            state.findIndex(
              (card) => card.id === action.payload.desId_Previous
            ) + 1

          //reorder
          if (desIndex > targetIndex) {
            let reorderItem = state[targetIndex]
            state.splice(desIndex, 0, reorderItem)
            state.splice(targetIndex, 1)
          } else {
            let reorderItem = state[targetIndex]
            state.splice(desIndex, 0, reorderItem)
            state.splice(targetIndex + 1, 1)
          }

          break
        }

        case "cross/remove": {
          //find onChange schedule
          let result = action.payload.result
          let target = state.find((card) => card.id === result.draggableId)
          target.status = 1

          //add locations
          let location = {
            itinerary_id: action.payload.itineraryId,
            dayplan_id: result.destination.droppableId,
          }
          if (!target.locations) {
            target.locations = []
          }
          target.locations.push(location)
          break
        }

        case "updateLocations": {
          let result = action.payload.result
          let target = state.find((card) => card.id === result.draggableId)
          let location = target.locations.find(
            (location) => location.dayplan_id === result.source.droppableId
          )

          location.dayplan_id = result.destination.droppableId
          break
        }

        default: {
        }
      }
    },
  },
})

export const {
  addCard,
  removeCard,
  modifyCard,
  updateCardsOrder,
} = cardSlice.actions

export default cardSlice.reducer
