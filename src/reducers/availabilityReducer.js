import { createSlice } from '@reduxjs/toolkit'

const availabilityReducer = createSlice({
    name: 'availabilityReducer',
    initialState: {
        events:[],
    },
    reducers: {
        setEvent(state, action) {
            state.events.push(action.payload);
        },
         
    },
})

export const { setEvent } = availabilityReducer.actions


export default availabilityReducer.reducer