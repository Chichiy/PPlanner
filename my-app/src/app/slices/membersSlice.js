import { createSlice } from "@reduxjs/toolkit"

export const membersSlice = createSlice({
  name: "members",
  initialState: [
    // {
    //   id: "aJyjoGPEIH69isQ7QfYs",
    //   name: "",
    //   picture: "",
    // },
  ],
  reducers: {
    addMember: (state, action) => {
      let target = action.payload

      //prevent repeatly adding when itinitallizing
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

    clearMembersState: (state, action) => {
      state.splice(0, state.length)
    },
  },
})

export const {
  addMember,
  modifyMember,
  removeMember,
  clearMembersState,
} = membersSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.member.value)`
// export const selectCount = (state) => state.member.value

export default membersSlice.reducer
