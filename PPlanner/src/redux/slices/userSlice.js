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
    updateUser: (state, action) => action.payload,
  },
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
