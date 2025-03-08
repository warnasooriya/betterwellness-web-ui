import { createSlice } from '@reduxjs/toolkit'

const availabilityReducer = createSlice({
    name: 'availabilityReducer',
    initialState: {
        availability:[],
    },
    reducers: {
        setAvailability(state, action) {
            state.availability.push(action.payload);
        },
        setAllAvailabilities(state, action) {
            state.availability = action.payload;
        },
         
    },

})

export const { setAvailability,setAllAvailabilities} = availabilityReducer.actions


export default availabilityReducer.reducer