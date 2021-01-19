import { createSlice } from "@reduxjs/toolkit"

export const membersSlice = createSlice({
  name: "members",
  initialState: [],
  reducers: {
    addMember: (state, action) => {
      let target = action.payload

      //prevent repeatedly adding when initializing
      if (state.findIndex((member) => member.id === target.id) < 0) {
        state.push(target)
      }
    },
    modifyMember: (state, action) => {
      let target = action.payload
      let index = state.findIndex((member) => member.id === target.id)
      state.splice(index, 1, target)
    },
    removeMember: (state, action) => {
      let target = action.payload
      let index = state.findIndex((member) => member.id === target.id)
      state.splice(index, 1)
    },

    clearMembersState: () => [],
  },
})

export const {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} = membersSlice.actions

export default membersSlice.reducer
