import { createSlice } from '@reduxjs/toolkit'

const userReducer = createSlice({
    name: 'userReducer',
    initialState: {
        role: null,
        user:{}
    },
    reducers: {
        setRole(state, action) {
            state.role = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
    },
})

export const { setRole, setUser } = userReducer.actions


export default userReducer.reducer