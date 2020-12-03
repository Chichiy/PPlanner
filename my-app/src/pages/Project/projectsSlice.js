import { createSlice } from "@reduxjs/toolkit"
import { getData, getFsData } from "../../firebase/Config"

export const projectsSlice = createSlice({
  name: "projects",
  initialState: [
    {
      id: "mG06SIS2LbvuKWOXdNSE",
      title: "test_project",
      creater: "aJyjoGPEIH69isQ7QfYs",
      members: ["jFz7tkCgR2bTkzHJd1jU", "aJyjoGPEIH69isQ7QfYs"],
    },
  ],
  reducers: {
    getProjects: (state, action) => {
      getFsData("projects", "id", "==", action.payload.project_id).then(
        (dayplans) => {
          state = dayplans
        }
      )
    },

    editProjectTitle: (state, action) => {
      let target = state.find(
        (project) => project.id === action.payload.projectId
      )
      target.title = action.payload.newTitle
    },
  },
})

export const { getProjects, editProjectTitle } = projectsSlice.actions

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
// in the slice file. For example: `useSelector((state) => state.projects.value)`
// export const selectCount = (state) => state.projects.value

export default projectsSlice.reducer
