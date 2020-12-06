import { createSlice } from "@reduxjs/toolkit"
// import { getFsData } from "../../../../firebase/Config"

export const dayplanSlice = createSlice({
  name: "dayplans",
  initialState: [
    // {
    //   id: "",
    //   date: "",
    //   schedule: [{ card_id: "" }],
    //   itinerary_id: "",
    // },
  ],

  reducers: {
    addDayplan: (state, action) => {
      let target = action.payload

      //prevent repeatly adding
      if (state.findIndex((dayplan) => dayplan.id === target.id) < 0) {
        state.push(target)
      }
    },
    removeDayplan: (state, action) => {
      let target = action.payload
      let index = state.findIndex((dayplan) => dayplan.id === target.id)
      state.splice(index, 1)
    },
    modifyDayplan: (state, action) => {
      let target = action.payload
      let index = state.findIndex((dayplan) => dayplan.id === target.id)
      state.splice(index, 1, target)
    },

    // initDayplans: (state, action) => {
    //   let dayplans = action.payload

    //   if (!dayplans instanceof Array) {
    //     state.splice(0, 1, dayplans)
    //   } else {
    //     state.pop()
    //     dayplans.forEach((dayplan) => {
    //       state.push(dayplan)
    //     })
    //   }
    // },

    updateScheduleOrder: (state, action) => {
      const result = action.payload.result

      const getIndex = (droppableId) => {
        return state.findIndex((dayplan) => dayplan.id === droppableId)
      }

      switch (action.payload.type) {
        case "sameDayplan": {
          //find onChange schedule
          let index = getIndex(result.destination.droppableId)

          //extract target from original position
          let [reorderItem] = state[index].schedule.splice(
            result.source.index,
            1
          )

          //put in new position
          state[index].schedule.splice(result.destination.index, 0, reorderItem)
          break
        }

        case "differentDayplans": {
          //find onChange schedule
          let destination =
            state[getIndex(result.destination.droppableId)].schedule
          let source = state[getIndex(result.source.droppableId)].schedule

          //add target to new position
          destination.splice(
            result.destination.index,
            0,
            source[result.source.index]
          )
          //remove target from original position
          source.splice(result.source.index, 1)

          //update locations info

          break
        }

        case "cross/add": {
          //prepare format
          let card = {
            card_id: result.draggableId,
            // duration: Number,
            // time: Number,
          }

          //find onChange schedule
          let destination =
            state[getIndex(result.destination.droppableId)].schedule

          //add target to new position
          destination.splice(result.destination.index, 0, card)
          break
        }

        case "cross/remove": {
          //find onChange schedule
          let source = state[getIndex(result.source.droppableId)].schedule

          //remove target from original position
          source.splice(result.source.index, 1)
          break
        }
        default: {
        }
      }
    },

    updateDayplan: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const {
  addDayplan,
  removeDayplan,
  modifyDayplan,
  updateScheduleOrder,
} = dayplanSlice.actions

export default dayplanSlice.reducer
