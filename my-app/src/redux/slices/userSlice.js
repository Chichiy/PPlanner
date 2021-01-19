import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    name: "",
    email: "",
    picture: "",
    projects: [],
  },
  reducers: {
    initUser: (state, action) => action.payload,
  },
})

export const { initUser } = userSlice.actions
export default userSlice.reducer
