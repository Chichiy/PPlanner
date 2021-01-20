import { createSlice } from "@reduxjs/toolkit"

export const projectsSlice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    updateProjects: (state, action) => action.payload,
  },
})

export const { updateProjects } = projectsSlice.actions
export default projectsSlice.reducer
